---
author: Tim Retout
layout: post
subtitle: Types of tests, and how many to write
title: The Test Pyramid
tags: testing advent-2017
---

*Part two of [a series of posts about automated testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Yesterday we talked about [risk-based
testing](/2017/12/01/risk-based-testing/). In general, however, there
is a standard recommendation for the ratio of unit, integration and
end-to-end tests we should be aiming for on most projects. That is
represented in the test pyramid:

![Test Pyramid: a small number of end-to-end tests, medium number of service tests and large number of unit tests]({{ "/images/test-pyramid.png" | absolute_url }})

 There is no industry consensus on the naming of these layers - for
 the avoidance of doubt:

- unit tests are small tests which run fast and avoid hitting
  resources such as the filesystem.
- service tests are integration tests which exercise a service boundary.
- end-to-end tests cover multiple services, and often are browser-based
  UI tests.

The advice is to aim for a 70-20-10 ratio as a first guess - i.e. 70%
of tests should be unit tests, etc.

This recommendation follows directly from the advice to get the most
"bang for the buck" from your tests - end-to-end tests tend to be
slow, flaky and unreliable, but are occasionally necessary. It makes
sense to put the majority of effort into unit testing, which offer
fast feedback and tend to be reliable in comparison. To ensure the
units work together, service tests are necessary.

The main barrier to achieving good test coverage with unit tests tends
to be code which is difficult to test. Writing testable code is a
discipline in itself.

## Further reading

- [https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html](Just say no to more end-to-end tests)

