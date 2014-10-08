---
layout: post
title: How we used git bisect to debug haproxy
author: tim
tags: git bisect haproxy tomcat solr debugging operations
---

Recently, we at [CV-Library](http://www.cv-library.co.uk/) were preparing an upgrade to the server
which runs many of our background processes.  It felt pretty risky,
because although none of our code would be changing, all the versions
of CPAN modules and supporting software would be updated.  So we
brought up a test server, and started looking for problems.

When testing a script that updates our Solr indexes, we saw these
strange errors coming back from Tomcat:

{% highlight http %}
HTTP/1.1 505 HTTP Version Not Supported
Connection: close
Date: Wed, 08 Oct 2014 10:28:16 GMT
Server: Apache-Coyote/1.1
{% endhighlight %}

Tomcat has a [history of returning 505 status codes](https://www.google.co.uk/search?q=tomcat+505) due to its
over-strict parsing of HTTP.  But we hadn't changed our code!  Our
suspicions immediately turned to haproxy, which we use to load balance
across the Solr cluster - the script did not return this error if we
pointed it directly at Tomcat.

The first step was to boil down our complex script into a reproducible
test case - one which did not hit our databases, making it much faster
to track down the cause.

{% highlight perl %}
#!/usr/bin/env perl

use strict;
use warnings;

use LWP::UserAgent;

my $json = do { local $/; <DATA> };

my $ua = LWP::UserAgent->new( keep_alive => 1 );

for (1..9) {
    my $reply = $ua->post(
        "http://localhost:7081/solr/some-alias/update?commit=true",
        Content_Type => 'application/json',
        Content      => $json,
    );

    exit 2 if $reply->code == 505;
}

exit 0;
__DATA__
<lots of JSON POST data followed>
{% endhighlight %}

It turned out the keep_alive option was important to reproduce the
issue.  We know from past experience that our script performance
suffers if we disable this option.

We were then able to confirm that the problem did not show under
haproxy 1.4.25, which we were using previously.  Studying the traffic
using Wireshark did not show anything obvious, and we confirmed that
the issue persisted on haproxy's master branch.

Since we were really stuck by this point, we resorted to a [git bisect](http://git-scm.com/docs/git-bisect).
This took a few goes to get right, but we ended up with a script like
this:

{% highlight bash %}
#!/bin/bash

make clean
make TARGET=linux2628

./haproxy -f ../haproxy.cfg &

function cleanup {
        killall haproxy
}

trap cleanup SIGHUP SIGINT SIGTERM

../haproxy-505

STATUS=$?

cleanup

if [ $STATUS == 0 ]; then
        exit 0
elif [ $STATUS == 2 ]; then
        exit 2
else
        exit 125
fi
{% endhighlight %}

Run like this:

{% highlight bash %}
$ git bisect start 1.5-dev10 master --
$ git bisect run ../bisect
{% endhighlight %}

That took us to [this commit](https://github.com/haproxy/haproxy/commit/70dffdaa10419c8cab039003f8b4a883e3f5648b),
first released in haproxy 1.5-dev22:

{% highlight bash %}
commit 70dffdaa10419c8cab039003f8b4a883e3f5648b
Author: Willy Tarreau <w@1wt.eu>
Date:   Thu Jan 30 03:07:23 2014 +0100
    
    MAJOR: http: switch to keep-alive mode by default
    
    Since we support HTTP keep-alive, there is no more reason for staying
    in tunnel mode by default. It is confusing for new users and creates
    more issues than it solves. Option "http-tunnel" is available to force
    to use it if really desired.
    
    Switching to KA by default has implied to change the value of some
    option flags and some transaction flags so that value zero (default)
    matches keep-alive. That explains why more code has been changed than
    expected. Tests have been run on the 25 combinations of frontend and
    backend options, plus a few with option http-pretend-keepalive, and
    no anomaly was found.
    
    The relation between frontend and backends remains the same. Options
    have been updated to take precedence over http-keep-alive which is now
    implicit.
    
    All references in the doc to haproxy not supporting keep-alive have
    been fixed, and the doc for config options has been updated.
{% endhighlight %}

Aha!  Reading up on 'http-tunnel', the behaviour of haproxy has
significantly changed - if you used a keep-alive connection, haproxy
1.4 would only process the first request, and it would then leave the
TCP connection open between client and server (i.e. no load
balancing).  In 1.5, haproxy by default will try to do clever stuff to
load balance keep-alive connections.

To work around this, for the moment we added this line to our
haproxy.cfg, to restore the default 1.4 behaviour:

{% highlight bash %}
option http-tunnel
{% endhighlight %}

There is still the small matter of investigating why Tomcat returns
the error code, and whether we can see performance benefits from
turning on the "real" keep-alive mode.  But for the moment, we have
reduced the risk of this server migration through careful planning and
testing.
