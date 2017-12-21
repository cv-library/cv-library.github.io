---
author: Tim Retout
layout: post
title: Measuring Coverage
subtitle: Devel::Cover and Devel::QuickCover
tags: perl testing advent-2017
---

*Part twenty-one of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

It is often not worth achieving 100% test coverage; [decisions about
testing should be based on
risk](http://tech-blog.cv-library.co.uk/2017/12/01/risk-based-testing/).
However, being able to look at which sections of code have been
covered, or spotting branches of code which have not been exercised,
can be very useful to evaluate whether tests are missing.

In Perl, [Devel::Cover](https://metacpan.org/pod/Devel::Cover) is the
standard option for measuring coverage.  You can generate HTML reports
showing statement coverage, branch coverage, and even pod coverage.

One of the downsides is that Devel::Cover can be quite slow.  If you
need something quicker,
[Devel::QuickCover](https://metacpan.org/pod/Devel::QuickCover) is a
useful alternative -it is limited to statement coverage, but can
generate output compatible with Devel::Cover, so you still get a
pretty HTML report.

Integrate one of these into your continuous integration server, and
you can have an up-to-date report of which areas of your code are low
on tests.

Remember, however, that high coverage does not imply good tests -
coverage just shows that the code was executed, but does not indicate
that the tests are maintainable or even correct.  In fact, you don't
even know whether the output was checked!
