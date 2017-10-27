---
author: Tim Retout
layout: post
title: Curse of the living OCSP requests
subtitle: The responses that refused to be stapled
tags: webpagetest ocsp tls nginx
---

With Hallowe'en on Tuesday, gather round _if you dare_ and listen to
our spoooky story of OCSP requests and Webpagetest.  These were... THE
RESPONSES THAT REFUSED TO BE STAPLED.

It all started one bright, sunny morning, when we observed closely
these mysterious lines in our waterfall report:

![WebPagetest waterfall showing two OCSP responses]({{ "/images/webpagetest-ocsp-before.png" | absolute_url }})

Yes, our first view response times were being haunted by OCSP
requests.  These were easily adding a whole second to our benchmarks.

(For the uninitiated,
[OCSP](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol)
is a method for web browsers to ensure that TLS certificates have not
been revoked by a certificate authority.  The browser will talk to a
server managed by the authority itself, and receive a signed response
saying whether a given certificate is still valid.  There are some
concerns with OCSP, and [Chrome has apparently chosen to disable
it](https://www.imperialviolet.org/2012/02/05/crlsets.html) in favour
of other mechanisms, but not for Extended Validation certificates.)

It was time to put a stake through the heart of this problem, and
implement [OCSP
Stapling](https://en.wikipedia.org/wiki/OCSP_stapling).  The server
can fetch and cache the OCSP response itself, and send it along with
the certificate when a browser visits.  This saves a request to the
OCSP server.

So we modified our nginx config, and we double-checked it, and
third-party tools said that all was well.  But then...

![WebPagetest waterfall showing one OCSP response]({{ "/images/webpagetest-ocsp-after.png" | absolute_url }})

...there's still an OCSP request on first view.  _(Cue blood-curdling
scream.)_

Squinting closely at the two waterfalls, we noticed that the first was
making requests to "g2.symcb.com" and then "gm.symcd.com".  The second
only requests "g2.symcb.com".  This was a clue - after inspecting our
certificates closely in the browser, we worked out that the remaining
request was actually for our intermediate certificate.

So OCSP Stapling was working as intended - it turns out that there is
no way currently to staple both OCSP responses; you can return only
one. (There is [RFC 6961](https://tools.ietf.org/html/rfc6961), but I
am not aware of any implementations.)

In practice, you just have to hope that browsers have already cached
your intermediate certificate validity elsewhere - they are used by
lots of different sites on the web, so this is quite possible.

Another solution would be to obtain a site certificate directly from a
root CA, but these are quite rare nowadays, for good security reasons.

Happy Hallowe'en!
