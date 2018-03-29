---
author: Tim Retout
layout: post
subtitle: Not per method
title: One test per behaviour
tags: perl testing advent-2017
---

*Part five of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

We are building a self-driving car in Perl.  It will pick up
jobseekers, and play upbeat music as it drives them to their job
interviews.  Consider this early code sample:

{% highlight perl %}
# Code
package Car;

use Moo;

has 'radio_station' => (is => 'ro');
has 'handbrake_status' => (is => 'ro');

sub drive {
    my ($self) = @_;
    $self->ensure_handbrake_off();
    $self->turn_wheels();
    $self->start_radio();
}

...
{% endhighlight %}

And a first stab at the tests:

{% highlight perl %}
# Tests
sub test_drive : Tests {
    my $car = Car->new(
        handbrake_status => 'on',
        radio_station => 'BBC Radio 1',
    );
    $car->drive();
    is( $car->handbrake_status(), 'off' );
    is( $car->speed(), '60' );
    is( $car->radio_playing(), 'BBC Radio 1' );
}
{% endhighlight %}

As more functionality gets added, the test becomes harder to read. As
more tests accumulate like this, a change to an obscure feature such
as the radio can require changes to hundreds of long tests. Instead,
aim to write one test per behaviour, not per method:

{% highlight perl %}
# Tests

sub drive_should_disable_handbrake : Test {
    my $car = Car->new( handbrake_status => 'on' );
    $car->drive();
    is( $car->handbrake_status(), 'off' );
}

sub drive_should_make_car_go_fast : Test {
    my $car = Car->new();
    $car->drive();
    is( $car->speed(), '60' );
}

sub drive_should_turn_on_radio : Test {
    my $car = Car->new( radio_station => 'BBC Radio 1' );
    $car->drive();
    is( $car->radio_playing(), 'BBC Radio 1' );
}
{% endhighlight %}

This produces shorter, more readable tests, which are easier to adapt
to new behaviours.

In addition, the tests end up describing the behaviour of the system
under test, which can help with understanding unfamiliar code.  This
relates closely to [yesterday's post about testing reusable
interfaces](https://tech-blog.cv-library.co.uk/2017/12/04/test-public-interfaces/).

## Further reading

- [Google Testing: Test behaviours, not methods](https://testing.googleblog.com/2014/04/testing-on-toilet-test-behaviors-not.html)
