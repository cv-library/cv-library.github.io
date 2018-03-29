---
author: Tim Retout
layout: post
title: Window Driver pattern
subtitle: Making end-to-end tests maintainable
tags: testing advent-2017
---

*Part nineteen of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

The Window Driver pattern is described in the book *Continuous
Delivery*.  It is explained there in terms of native GUI apps, but is
easy to adapt to browser-based tests.

When writing end-to-end tests, it is easy to get bogged down in the
details of the UI being tested - each time the UI changes in a crucial
part of the system (e.g. a change to the login page), any test which
uses that page needs updating - the tests become tightly coupled to
the UI.

Instead, creating "Drivers" for each section of the UI lets you add a
layer of indirection between the tests and the UI being tested.  The
drivers are still tightly coupled to the user interface, but the
details of CSS selectors and HTML class names are abstracted from the
test logic, so the code can be updated in one place only.

![Window driver pattern]({{ "/images/window-driver-pattern.png" | absolute_url }})

Additionally this allows the test logic itself to become clearer,
because it is not cluttered with the mechanics of the UI being tested.
The drivers can have methods expressed in high-level concepts, such as
"register user", "run a search", instead of tedious details about how
those use cases are solved.

## Further reading

- Jez Humble and David Farley, *Continuous Delivery*, Pearson, 2011.
