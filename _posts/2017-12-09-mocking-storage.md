---
author: Tim Retout
layout: post
subtitle: Persistence is key
title: Mocking filesystems and database access
tags: perl testing advent-2017
---

*Part nine of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Mocking out time required overriding a relatively small number of core
functions.  For something like filesystem access, there are a wide
range of system calls: open, close, read, write, seek, chmod, chdir...

It is a similar situation with databases - in both cases there is a
resource which is relatively slow and expensive to access.

It is worth taking a step back and thinking about what needs testing.
Often it may be possible to restructure the code itself to separate
persistence store access from other business logic:

{% highlight perl %}
package Local::Application::ListManager;

use Moo;

has fs => (is => 'ro');

sub is_on_naughty_list {
    my ($self, $name) = @_;

    my $file = $self->fs->open( 'naughty_list.txt' );
    while (my $line = <$file>) {
        if ($line eq $name) {
            return 1;
        }
    }

    return 0;
}

package Local::Infrastructure::UnixFilesystem;

use Moo;

sub open { ... }

1;
{% endhighlight %}

With the classes arranged like this, it becomes relatively easy to
test ListManager, by creating a mock filesystem where naughty_list.txt
contains test data.

To test the production store implementation will require a small
integration test - but this was always true.  The implementation of
the filesystem class can be kept simple and straightforward, which
should make it easier to review.  Plus it will be easier to swap out
for an alternative implementation later.

