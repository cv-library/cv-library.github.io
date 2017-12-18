---
author: Tim Retout
layout: post
title: End-to-end tests
subtitle: Automating browser-based testing
tags: testing advent-2017
---

*Part eighteen of [a series of posts about automated
 testing](http://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

As [we discussed
previously](http://tech-blog.cv-library.co.uk/2017/12/02/test-pyramid/),
the standard advice is to minimize the number of browser-based
end-to-end tests written.  The advantage of e2e tests is that they
mimic a real user; the disadvantage is that they tend to be slow and
unreliable.

Still, there are some system elements that are very unusual to
exercise in other types of test; you can test the deployment process
(assuming you deploy into a testing environment very similar to
production), and you can test that things like network configuration
and DNS names are wired up correctly.

In the context of web applications, e2e tests involve automating
browser actions, to navigate to URLs on the site, and "click" page
elements to simulate a real user.  There are also systems which can
orchestrate e2e tests for mobile applications,
e.g. [Appium](http://appium.io/) or [Calabash](http://calaba.sh/).

The de-facto standard for browser automation is the [WebDriver
protocol](https://www.w3.org/TR/webdriver/), which grew out of the
Selenium project.  These days all major browsers have solutions for
implementing the protocol - you can talk to a REST API and have your
browser perform actions on your behalf.

It is not straightforward to keep end-to-end tests maintainable, so in
the next posts we will share some approaches we have found helpful for
writing and organising these tests.

## Further reading

- [Google Testing Blog: Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html)
- [What Makes a Good End-to-End Test?](https://testing.googleblog.com/2016/09/testing-on-toilet-what-makes-good-end.html)
