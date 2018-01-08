---
author: Tim Retout
layout: post
title: Template Toolkit Filter plugin leak
subtitle: In which we work around an upstream bug, and save memory
tags: perl template-toolkit memory leak
---

In our Perl web code we use [Template
Toolkit](http://template-toolkit.org/), and we have extended the
engine by writing various plugins where we have found them useful.

One such plugin extended Template::Plugin::Filter as follows (details
have been changed to protect the innocent):

{% highlight perl %}
package CVLibrary::Template::SomeFilter;

use strict;
use warnings;

use parent 'Template::Plugin::Filter';

use SomeModule 'some_function';

sub init {
    my $self = shift;
    $self->{_DYNAMIC} = 1;
    $self->install_filter('some_function');
    return $self;
}

sub filter {
    return some_function( $_[1] );
}

1;
{% endhighlight %}

This filter plugin has been in production for quite some time, and as
far as we knew, it worked well.  Recently, however, we started paying
more attention to memory leak issues (the subject, I'm sure, of a
future blog post).

We found that Template::Plugin::Filter was creating a [circular
reference](http://perldoc.perl.org/perlref.html#Circular-References),
and tracked this down to a particular upstream bug:

* [https://metacpan.org/source/ABW/Template-Toolkit-2.27/lib/Template/Plugin/Filter.pm#L74](https://metacpan.org/source/ABW/Template-Toolkit-2.27/lib/Template/Plugin/Filter.pm#L74)
* [https://rt.cpan.org/Public/Bug/Display.html?id=46691](https://rt.cpan.org/Public/Bug/Display.html?id=46691)

As you can see, in the source the "weaken" call which would fix the
leak has been commented out.  The comments above that line detail the
reason why, and ask us to wait until enough people report memory leak
issues!

The unweakened reference means that if you "use" the filter more than
once per template object, one of the instances will not get cleaned
up.  For example:

```
[% USE SomeFilter %]
[... and later, perhaps in an included template ...]
[% USE SomeFilter # this leaks the original plugin instance %]
```

At this point I'd love to be able to say that we fixed this upstream
bug.  Alas, we haven't.  However, we found a workaround, by rewriting
our template plugin to avoid the module with the leak (and make it
shorter!):

{% highlight perl %}
package CVLibrary::Template::SomeFilter;

use strict;
use warnings;

# Can't use "Template::Plugin::Filter" as it leaks:
# https://rt.cpan.org/Public/Bug/Display.html?id=46691
use parent 'Template::Plugin';

use SomeModule ();

sub new {
    my ( $class, $context ) = @_;

    $context->define_filter(
        some_function => \&SomeModule::some_function );

    bless {}, $class;
}

1;
{% endhighlight %}

It turns out that for short filters, the base class is not hiding much
complexity after all, so we can inherit directly from
Template::Plugin, avoiding the problematic code.

(Credit is due to James Raspass for actually doing the
debugging/development work on this issue!)
