---
author: Tim Retout
layout: post
title: Feedback Loops
subtitle: Plan, Do, Check, Act
tags: testing advent-2017
---

*Part twenty-two of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

The [Deming cycle](https://en.wikipedia.org/wiki/PDCA) (Plan, Do,
Check, Act) is a model for thinking about continuous improvement of
processes such as software development.

A crucial insight related to this is that the rate of improvement
depends on having feedback loops as small as possible; the quicker you
can get information about the quality of the software (in the "Check"
phase), the quicker you can "Act" to adjust development in the right
direction.

Automated testing is a means of speeding up this feedback (compared to
manual testing) - if you can verify that your changes have not
introduced regressions, then you can spend more time testing new
features, or move on to the next change.  This also suggests a reason
that fast unit tests are often preferable to slow end-to-end tests.

To get the quickest feedback, you need to be running the test suite
frequently - these days it is quite common to run tests on every
commit via a continuous integration server like Jenkins.

How far can you take this idea?  If the tests are fast enough, you
should be able to integrate them with your editor or IDE to be run
whenever a file is saved.  This improves the experience of test-driven
development, and informs you of test failures before code is even
committed.

This idea, of speeding up feedback, is very widely applicable - this
the same reason that User Acceptance Testing (which could be
considered to be another form of manual testing) should be happening
before code review!  No point bothering other developers for review or
testing if it turns out you are building the wrong thing.
