---
author: Tim Retout
layout: post
title: Contract tests
subtitle: Pacts between microservices
tags: microservices testing advent-2017
---

*Part seventeen of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Continuing the example from [yesterday's
post](https://tech-blog.cv-library.co.uk/2017/12/16/testing-microservices/),
we would like to create some form of tests to catch incompatible
changes in the geolocation service, which would potentially break the
navigation service.

Suppose the response from the geolocation service is JSON:

{% highlight json %}
{
    "id": "123",
    "lat": "51.2",
    "lon": "-0.83",
    "name": "Fleet",
    "county": "Hampshire",
    "country": "UK"
}
{% endhighlight %}

Santa's navigation service, however, uses only the latitude and
longitude fields.  The navigation service could create a "contract"
between itself and the geolocation service, that required the latter
to provide the lat/lon fields.  The geolocation service could then run
these as regression tests on every build.

This way, if a change to geolocation broke functionality that the
navigation service relied upon, it would be flagged up before release.

These contract tests will have fewer moving parts than full end-to-end
tests, so will be faster and more reliable.

There is software available that implements this kind of testing
framework - [Pact](https://docs.pact.io/) is one option, and it has
native ports to many languages (plus a docker-based solution if there
is no native port).

## Further reading

- [Pact docs](https://docs.pact.io/)
