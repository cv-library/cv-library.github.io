---
author: Tim Retout
layout: post
title: Continuous Delivery
subtitle: Building a pipeline
tags: testing advent-2017
---

*Part twenty-three of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

So you've written some tests.  What do you do with them?

If you have automated your deployment process, then a good test suite
enables the building of a deployment pipeline - get a continuous
integration server to build your code, run your tests, and deploy to a
staging or production environment (optionally with manual triggers to
control release to production).

The goal is to learn about errors as quickly as possible, so this
generally means that tests are run in order of speed; unit tests
first, end-to-end tests last.  (It's also possible to have a set of
tests where failures are indicative only; e.g. less reliable
end-to-end tests; they don't necessarily block release.)

Manual testing can also be integrated into this pipeline.  If the
system deploys first to a staging environment, manual testing can be
performed there before release to production.  Feature flags can allow
features to be developed in the background, only switched on for real
users once staff have agreed that they are happy with the experience.

Things which make this approach easier to implement include good
monitoring of both server and business-level metrics; good logging to
help debug problems; but most important is having a test suite that
actually catches bugs.

## Further reading

- Jez Humble and David Farley, *Continuous Delivery*, Pearson, 2011.