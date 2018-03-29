---
author: Tim Retout
layout: post
subtitle: Red, Green, Refactor
title: Test-Driven Development
tags: perl testing advent-2017
---

*Part ten of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

While discussing unit testing, it is worth looking at the idea of
test-driven development, and how we might use it to improve the
quality of our code.

The TDD approach goes:

1. Write one failing test ("Red")
2. Write the smallest change that makes all tests pass ("Green")
3. Refactor the code to remove duplication etc. ("Refactor")

Repeat until done.

The devil is perhaps in the detail.  TDD demands small increments of
code - it can be tempting to jump ahead.  For example, given this test
case:

{% highlight perl %}
sub score_should_be_zero : Test {
    is(score(), 0);
}
{% endhighlight %}

If score() has not been written, the test doesn't compile, so it can't
be "red".  The test has to compile *and fail*, so the next step is:

{% highlight perl %}
sub score {
    return -1;
}
{% endhighlight %}

Note that we do not return zero yet!  This is to ensure that the test
is actually testing the right thing - if you get a green bar at this
point, you can spot something is wrong.  Finally you correct the
implementation to match the test:

{% highlight perl %}
sub score {
    return 0;
}
{% endhighlight %}

The recommended way to get into TDD is to practice TDD kata - short
exercises which you repeat daily until you have mastered them, then
you move on to the next one.  The example above is adapted from the
[bowling game
kata](http://butunclebob.com/ArticleS.UncleBob.TheBowlingGameKata),
which comes with a worked example.  Search online for more.

TDD is great when writing code from scratch, but it can be more
difficult to apply to legacy code, because:
- if you don't already have a good test suite, it is hard to refactor
  correctly.
- often it is hard to isolate external dependencies in order to unit
test code, unless the code has been written with testing in mind.

Therefore in this series we will move on to consider how to write code
which is easy to test.