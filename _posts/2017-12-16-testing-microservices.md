---
author: Tim Retout
layout: post
title: Testing microservices
subtitle: Component/Service tests
tags: micoservices testing advent-2017
---

*Part sixteen of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

So far we have mainly talked about unit tests, and about various
necessary approaches for making code easy to test.  However, testing
all the individual units of a system does not guarantee that the
behaviour of the system as a whole is correct - we need to consider
how the parts interact.

Santa's elves have started refactoring their legacy monolithic code
base into a trendy microservices architecture, and are breaking out a
service that handles navigation for Santa's sleigh.

![Sleigh services: navigation and geolocation]({{ "/images/sleigh-services.png" | absolute_url }})

The navigation service depends on another which does geolocation.  How
should the elves test the behaviour of the navigation service?

Rather than jumping straight to browser-based end-to-end tests (of
which more in a later post), it would be preferable to test one
microservice at a time - faster, more reliable, and quicker to
understand when a failure occurs.  Tests which exercise one
microservice might be known as "component tests" or "service tests".

One option is to use [mountebank](http://www.mbtest.org/) or similar
to create a stub geolocation service.  This can be configured to
respond to calls which the navigation service makes, and then the test
code can exercise the navigation service running as it would in
production.  This might be called an "out-of-process component test".

Another option is an "in-process component test" - this is where the
test loads up the code for the microservice, but using an in-memory
database, say, and using stub client libraries to avoid network
connections to other services.  The trade-off here is that the test
will be faster, but this approach does require running slightly
different code during testing compared to production.

Component tests exercise only one service at a time (by definition).
It would be possible for the navigation and geolocation services in
this example to both have component tests, but fail to talk to each
other.  Next we will explore approaches for preventing this.

## Further reading

- [Testing Strategies in a Microservice Architecture](https://martinfowler.com/articles/microservice-testing/)
