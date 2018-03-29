---
author: Tim Retout
layout: post
subtitle: Ask for things, don't look for things.
title: Dependency Injection
tags: perl testing advent-2017
---

*Part eleven of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

To make unit testing possible, you need to be able to mock out
accesses to resources such as the filesystem and databases.  The best
way to make that possible is to use dependency injection - ask for the
collaborators at construction time.

For example, in Perl:

{% highlight perl %}
package Santa::Workshop;

use Moo;

has elves => (is => 'ro', required => 1);
has conveyor_belt => (is => 'ro', required => 1);
has wrapping_paper => (is => 'ro', required => 1);

...
{% endhighlight %}

These collaborators can be wired up using a dependency injection
framework such as Bread::Board, or manually.  Mocking these
collaborators out becomes much easier than if they were created by the
Workshop class itself.

## Further reading

- [Google Testing: Writing Testable Code](https://testing.googleblog.com/2008/08/by-miko-hevery-so-you-decided-to.html)
- [Wikipedia: Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter)
