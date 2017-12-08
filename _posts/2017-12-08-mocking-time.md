---
author: Tim Retout
layout: post
subtitle: Stop! Can't tick this.
title: Mocking Time
tags: perl testing advent-2017
---

*Part eight of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

How does Santa deliver presents to all the millions of children on
Christmas Eve?  Simple, just stop time!  But how do we test that?

Here's one way to do it in Perl:

{% highlight perl %}
use Test::MockTime qw( :all );

my $santa;

sub setup : Test(setup) {
    $santa = Santa->new();
}

# FIXME: these tests are specific to GMT
sub santa_should_not_deliver_presents_before_midnight : Test {
    set_absolute_time('2017-12-24T23:59:59Z');
    is($santa->has_delivered_presents(), 0);
}

sub santa_should_have_delivered_all_presents_after_midnight : Test {
    set_absolute_time('2017-12-25T00:00:01Z');
    is($santa->has_delivered_presents(), 1);
}
{% endhighlight %}

By messing with the clock, we can quickly test all sorts of
time-dependent code, without having to call sleep() and slowing down
the tests.

## Further reading

- [Test::MockTime](https://metacpan.org/pod/Test::MockTime)
- [Google Testing: Simulating Time in jsUnit Tests](https://testing.googleblog.com/2007/03/javascript-simulating-time-in-jsunit.html)
