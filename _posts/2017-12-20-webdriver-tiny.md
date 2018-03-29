---
author: Tim Retout
layout: post
title: WebDriver::Tiny
subtitle: Browser automation with Perl, but smaller
tags: testing advent-2017
---

*Part twenty of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

The most popular tool for browser automation is Selenium. There have
been various different projects under the "Selenium" umbrella, but the
most recent one is Selenium WebDriver. Out of this has been spun the
WebDriver protocol.

WebDriver itself is essentially a REST API specification that happens
to be supported by the major browsers. Once you switch it on in your
browser, it will start listening on a network port, and should respond
to commands that you send it. This can then be used to automate
browser-based testing.

From Perl, the most popular CPAN module for using this protocol is
[Selenium::Remote::Driver](https://metacpan.org/pod/Selenium::Remote::Driver);
but at the time we were developing our end-to-end tests, we found it
somewhat hard to understand.  Our very own James Raspass wrote
[WebDriver::Tiny](https://metacpan.org/pod/WebDriver::Tiny) as a
smaller alternative, and it is serving us well.

The most recent update at the time of writing was a bug fix release
just a few days ago.  Check it out!

## Further reading

- [WebDriver specification](https://www.w3.org/TR/webdriver/)
- [WebDriver::Tiny on metacpan](https://metacpan.org/pod/WebDriver::Tiny)
- [WebDriver::Tiny on github](https://github.com/cv-library/WebDriver-Tiny)
