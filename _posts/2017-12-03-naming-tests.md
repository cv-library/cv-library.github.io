---
author: Tim Retout
layout: post
subtitle: That which we call a test, by any other name would fail its suite...
title: What's in a test name?
tags: perl testing advent-2017
---

*Part three of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Naming things is one of the hard problems of computer
science. However, when it comes to tests, here's a guideline that
could help: include both the condition and the expected behaviour in
the test name.

Consider this short example, using [Test::Class](https://metacpan.org/pod/Test::Class):

{% highlight perl %}
sub frobnicate_returns_false : Test {
    ok(!$widget->frobnicate());
}
{% endhighlight %}

This might produce the following warning:

{% highlight TAP %}
# This message might be ambiguous
not ok 1 - frobnicate returns false
{% endhighlight %}

But when you see this test error (perhaps six months after writing the
test), it is not obvious whether "returns false" is meant to be the
error condition or the expected behaviour.

Including the word "should" is often helpful.  Compare the previous
example with this friendlier message:

{% highlight TAP %}
# Good message - contains conditions and expected behaviour
not ok 1 - frobnicate with no arguments should return false
{% endhighlight %}

And the code to achieve this:

{% highlight perl %}
sub frobnicate_with_no_arguments_should_return_false : Test {
    ok(!$widget->frobnicate());
}
{% endhighlight %}

## Further reading

- [Google Testing: Naming unit tests responsibly](https://testing.googleblog.com/2007/02/tott-naming-unit-tests-responsibly.html)
- [Google Testing: Stroop effect](https://testing.googleblog.com/2008/02/tott-stroop-effect.html)
- [Google Testing: Writing descriptive test names](https://testing.googleblog.com/2014/10/testing-on-toilet-writing-descriptive.html)
