---
author: Tim Retout
layout: post
subtitle: In general, avoid tests relying on implementation details.
title: Prefer testing reusable interfaces
tags: perl testing advent-2017
---

*Part four of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Tests can be used to document behaviour, and to ensure that APIs you
are writing are easy to use for the caller.  If implementation details
of your code change, but the interface is stable, the tests themselves
should not need to change (except for fixture setup code).  To get the
most benefit from tests, they should in general be written against
reusable APIs, not against implementation details.

For example, as part of our work subcontracting for Santa's elves, we
have built this Sleigh Wash service:

{% highlight perl %}
package Local::Application::SleighWash;

use Moo;
use Carp;

has max_height => (is => 'ro');

sub wash_sleigh {
    my ($self, $sleigh, %options) = @_;

    $self->_check_sleigh_height($sleigh); # throws if too tall

    ... # confidential sleigh wash details redacted
}

sub _check_sleigh_height {
    my ($self, $sleigh) = @_;

    if ($sleigh->height() > $self->max_height()) {
        croak "Sleigh too tall!";
    }
}

1;
{% endhighlight %}

Rather than test the "_check_sleigh_height" method directly, it is
better to exercise "wash_sleigh".  This ensures that:

- if we later want to refactor how the internal checks are
  arranged, the tests will enable us to do that, and
- we make sure wash_sleigh hasn't forgotten to call the private
  method.

The same principle can apply to entire classes which are just
implementation details called from a single place, where all the
behaviour can be exercised via the public API.

There can be exceptions to this rule, where specific implementation
details need to be tested (e.g. confirming security or performance
properties), but these should be more unusual.

## Further reading

- [Google Testing: Test behaviour, not implementation](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html)
- [Google Testing: Prefer testing public APIs over implementation detail classes](https://testing.googleblog.com/2015/01/testing-on-toilet-prefer-testing-public.html)

