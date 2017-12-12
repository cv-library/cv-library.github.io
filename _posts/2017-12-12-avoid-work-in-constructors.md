---
author: Tim Retout
layout: post
subtitle: Laziness is a virtue
title: Avoid work in constructors
tags: perl testing advent-2017
---

*Part twelve of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Take this contrived example of a class with configuration read from a
file on disk:

{% highlight perl %}
package ToyWrapper;

use Config::Tiny;

sub new {
    my $class = shift;
    my %args = @_;
    my $config = Config::Tiny->new->read($args{config_file});

    bless {
        config => $config,
    }, $class;
}

sub wrap_toy {
    my $self = shift;
    my $use_bow = $self->config->{use_bow};
    ...
}

1;
{% endhighlight %}

When it comes to testing the toy wrapper, each test will need to set
up a slightly different configuration, to see how the behaviour is
affected.  But we're making life very hard for ourselves - we need to
somehow intercept the filesystem calls made by a third-party module,
before we can even begin testing.

Instead, let your class ask for just the config object to be injected
at construction time, and let some separate code take responsibility
for reading files off disk.  Because there's no unusual behaviour
needed in the constructor, it disappears when using Moo or Moose:

{% highlight perl %}
package ToyWrapper;

use Moo;

has config => (is => 'ro', required => 1);

sub wrap_toy { ... }

1;
{% endhighlight %}

Constructing objects for testing now becomes trivial.  The same
principle applies to any sort of resource access at construction time;
don't do it, and avoid similar ideas such as init() methods.  These
generally point to the need for a separate class to do object
instantiation.

## Further reading

- [Google Testing: Writing Testable Code](https://testing.googleblog.com/2008/08/by-miko-hevery-so-you-decided-to.html)
