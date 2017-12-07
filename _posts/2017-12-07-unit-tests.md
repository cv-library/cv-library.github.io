---
author: Tim Retout
layout: post
subtitle: classic vs. mockist
title: Unit Testing
tags: testing advent-2017
---

*Part seven of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Most of the advice so far has been generic to any type of testing.  In
the next few posts in this series, I want to look more specifically at
unit testing.

Unit testing has the potential to be highly cost-effective; the key
characteristics of unit tests are:

- they avoid hitting slow resources such as the filesystem or the network
- as a consequence they run quickly - pure-CPU workloads are generally fast
- with mocking, it can be easier to test unusual error situations (such as error responses from remote services)

Once a codebase becomes larger than a single class, there are two
schools of thought about the preferred scope of unit tests - should
every collaborator of a class be mocked out, or is calling other
classes okay (so long as they do not hit external resources)?  These
are sometimes called the "mockist" and "classic" schools, or "London"
and "Chicago" in the context of TDD.

It seems unlikely that there's one correct answer here - it depends on
whether verifying the behaviour or verifying the results of the call
is a more appropriate way of ensuring quality in each case.
Refactoring tests which use mocks may also be challenging - and it is
important to avoid accidentally mocking out the system under test.

## Further reading

- [Martin Fowler: Unit Test](https://martinfowler.com/bliki/UnitTest.html)
