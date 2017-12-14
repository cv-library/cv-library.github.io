---
author: Tim Retout
layout: post
title: Value objects
subtitle: ...are valuable for testing
tags: perl testing advent-2017
---

*Part fourteen of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Value objects are defined by their attributes - if two value objects
have the same attributes, they are equal.  For example:

{% highlight perl %}
package Seasonal::Colour;

# Store RGB values as hex codes
has red => (is => 'ro');
has green => (is => 'ro');
has blue => (is => 'ro');

sub to_string {
    my $self = shift;
    return "#" . $self->red . $self->green . $self->blue;
}

1;
{% endhighlight %}

Two of these objects with the same red/green/blue values define the
same colour - it would not make sense to compare the memory address of
these objects when judging if they were equal.

Why does this matter for testing?  Identifying which objects are value
objects can help prevent over-mocking - these types of objects are
easy to construct, so there is no advantage to replacing them with
fake implementations.
