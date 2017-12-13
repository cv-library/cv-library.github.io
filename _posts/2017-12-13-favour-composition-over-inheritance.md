---
author: Tim Retout
layout: post
subtitle: Polymorphism with seams
title: Favour composition over inheritance
tags: perl testing advent-2017
---

*Part thirteen of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

The idea that object composition is to be preferred to class
inheritance goes back a long way - it is discussed in the Gang of Four
"Design Patterns" book from 1995.  More recently, programming
languages are appearing which avoid including inheritance at all
(e.g. Golang and Rust).

Let's imagine Santa's sleigh can use either reindeer or a jet engine
as a source of power.  Here's an approach that uses inheritance to
share code between the implementations:

{% highlight perl %}
package Sleigh;

use Moo;

sub load_presents {
    print "loading presents!\n";
}

sub dash_away {
    my $self = shift;
    $self->load_presents;
}

package ReindeerSleigh;

use Moo;

extends 'Sleigh';

sub dash_away {
    my $self = shift;
    $self->SUPER::dash_away(@_);
    for (qw(Dasher Dancer Prancer Vixen Comet Cupid Donner Blitzen)) {
        print "Come $_!\n";
    }
}

package JetEngineSleigh;

use Moo;

extends 'Sleigh';

sub dash_away {
    my $self = shift;
    $self->SUPER::dash_away(@_);
    print "Ignite the Christmas spirit!";
}
{% endhighlight %}

When it comes to unit testing these classes, it is difficult to
isolate the behaviour which is unique to the power source for testing.
You need to instantiate and load presents onto the sleigh to test we
are calling the names of the reindeer correctly (and loading that many
presents will make the tests slow).

In general there is no "seam" between the child and the parent class,
so you are forced to test them together.

Compare with the composition approach, where testing the collaborators
in isolation will be trivial:

{% highlight perl %}
package Sleigh;

use Moo;

has power_source => (is => 'ro', required => 1);

sub load_presents {
    print "loading presents!\n";
}

sub dash_away {
    my $self = shift;
    $self->load_presents();
    $self->power_source->run();
}

package Reindeer;

use Moo;

sub run {
    for (qw(Dasher Dancer Prancer Vixen Comet Cupid Donner Blitzen)) {
        print "Come $_!\n";
    }
}

package JetEngine;

use Moo;

sub run {
    print "Ignite the Christmas spirit!";
}

{% endhighlight %}

## Further reading

- [Wikipedia: Composition over inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance)

