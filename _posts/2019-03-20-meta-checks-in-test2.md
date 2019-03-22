---
author: José Joaquín Atria
layout: post
title: Meta checks in Test2::Suite
subtitle: Here a prop, there a prop, everywhere a prop prop
tags: perl test2 cpan
---

We're big fans of the Test2 framework, and we use it in all our tests (except
for those we haven't found an excuse to upgrade just yet).[^1]

[^1]: This probably explains why we've even decided to write an xUnit toolkit
      for Test2: [Test2::Tools::xUnit][xunit], which you can find on CPAN.

One of the features we love about Test2 is the way you can use check builders
to specify the expected results of an operation as specifically as you want
(the documentation for [Test2::Tools::Compare][compare] is an excellent place
to start to get an idea for how this looks).

This came in handy in a test we were recently writing, which contacted a
service that would return a list of entities. After browsing the documentation,
this is what we wanted to have:

{% highlight perl %}
is \@array, array {
    all_item hash { ... }; # All items are valid entities
    prop size => EXPECTED; # We got the right number of them
    etc;
};
{% endhighlight %}

However, this was not supported, and a test like the one above would die with

> 'Test2::Compare::Array=HASH(…)' does not support meta-checks

The easy fix was to look for a workaround.

The first attempt was to manually check the number of expected items, and
assert that there were no others. This was easy if we made use of the fact
that Test2::Suite are code blocks and that checks can be stored and re-used:

{% highlight perl %}
my $check = hash { ... };
is \@array, array {
    item $check for 1 .. EXPECTED;
    end;
};
{% endhighlight %}

But since we needed to have the `end` at the end to make sure no other entries
existed, this meant we could run no other more specific checks on certain
items, so it was a limited solution.

We could instead have two separate tests: one for the number of values, one for
the values themselves. But this meant that we were running _at least_ one more
test per check, and we lost some of the expressiveness of the tests.

Another possibility was to combine them into a single call using a `meta`
check, with our initial check nested inside:

{% highlight perl %}
is \@array, meta {
    prop size => EXPECTED;
    prop this => array {
        all_item hash { ... };
        etc;
    };
};
{% endhighlight %}

But at this point it was starting to feel like these were hoops for us to jump
through, rather than the result of a design rationale we didn't understand.

A search through the Test2::Suite issue tracker revealed [an issue raised in
2017][issue] about precisely this feature (or lack thereof), but the issue had
received little attention. So we went ahead and [implemented the feature
ourselves][pr] with the idea that at the very least, we'd get an answer as to
_why_ these meta checks were not supported.

And it was a good thing, too, since it turned out that the reason the feature
was not supported was more due to the order in which the features had
originally been written. A day after our contribution was made, [a new version
had hit CPAN][new].

All in all, this turned out to be a big win for developer laziness, and we are
happy we could make a (small) contribution to a tool we use every day.

And of course, a big thank you to [Chad Granum][exodist] for all the hard work
and a lightning-fast response!

[issue]: https://github.com/Test-More/Test2-Suite/issues/131
[pr]: https://github.com/Test-More/Test2-Suite/issues/177
[xunit]: https://metacpan.org/pod/Test2::Tools::xUnit
[compare]: https://metacpan.org/pod/Test2::Tools::Compare
[exodist]: https://metacpan.org/author/EXODIST
[new]: https://metacpan.org/release/EXODIST/Test2-Suite-0.000119
