---
author: Tim Retout
layout: post
subtitle: Good bets and bad bets
title: Risk-based testing
tags: perl testing risk advent-2017
---

*It's the first day of Advent! Welcome to a series of blog posts about
 automated testing.*

Why do we spend time on tests?  This applies to both automated and
manual testing.

Looked at from the point of view of the business sponsors, investing
in testing is a gamble; there is an up-front cost (the developer time
needed to write the tests) and an uncertain reward (stopping a future
bug, or enabling future changes to happen faster). We ought to choose
our test strategy to maximize our expected return on the bet.

Some tests are bad bets, because they will never catch a bug (or at
least not one that justifies the effort of the test):

{% highlight perl %}
# Code to be tested
package Car;

use Moo;

... # more methods

# Tests

ok(Car->new(), "Car should be constructable");
{% endhighlight %}

Sometimes the main risk on a project is in a particular area or
non-functional requirement. For example, you might have a system where
the performance of the code is critical; a performance regression test
would be a good bet here, but that same test could be a waste of time
on less important systems.

So the goal of our testing is not to have 100% coverage, but rather to
attempt to save more time/cost in the long run than the cost of
maintenance.

## Further reading

- https://en.wikipedia.org/wiki/Risk-based_testing
- https://testing.googleblog.com/2014/05/testing-on-toilet-risk-driven-testing.html
