---
author: Tim Retout
layout: post
title: Perl as PID 1 under Docker
subtitle: How to shut down gracefully
tags: perl docker init signals
---

Increasingly we run our Perl programs inside docker containers,
because there are advantages in terms of isolation and deployment.
Containers provide applications with an idealized view of the OS -
they see their own filesystem, their own networking stack, and their
own set of processes.

Running the application as PID 1 inside the container comes with
[well-documented challenges around child process zombie
reaping](https://blog.phusion.nl/2015/01/20/docker-and-the-pid-1-zombie-reaping-problem/),
but we knew about that and understood it.  However, it turns out there
is a separate issue with signal handling, which we had not fully
appreciated.

## The problem: shutting down gracefully

Recently we moved one of our Perl daemon processes to run inside
docker - this is a system which has a few dozen worker instances
running, consuming jobs from a queue.

The problem was, it was taking a long time to deploy all of these
instances - each one would take 10 seconds to shut down.  On closer
inspection, 'docker stop' was waiting for them to terminate
gracefully, then after 10 seconds giving up and sending a kill signal.

We reproduced this with a one-liner:

{% highlight text %}
$ docker run debian perl -E 'sleep 300'
^C
[refuses to die]
{% endhighlight %}

(Of course, Ctrl+C sends SIGINT rather than SIGTERM, but sending
 SIGTERM manually had the same effect.  'docker stop' could shut it
 down, but only after the timeout and sending a SIGKILL.)

This confused us.

## What's going on: PID 1 signal handling

Adding a signal handler shows that the signal is actually received by
the script:

{% highlight text %}
$ docker run debian perl -E '$|=1; $SIG{TERM}=sub{say "Received SIGTERM"}; sleep 300 while 1'
[Send SIGTERM from other terminal]
Received SIGTERM
{% endhighlight %}

So although under normal circumstances an unhandled SIGTERM would mean
the program shuts down, when running as PID 1 this is not true.

It turns out [this behaviour is controlled by the
kernel](https://github.com/Yelp/dumb-init#why-you-need-an-init-system);
this was the other half of the justification for Yelp's dumb-init
system, not just the zombies.

In other words, while normally the kernel would apply default
behaviour if our process received a TERM or INT signal that it wasn't
handling, when running as PID 1 this is not applied.

## Why this confused us: Golang is special

Why did it take us so long to notice this behaviour?  We've been using
docker for ages.

However, mostly we've been using it with statically-compiled Golang
binaries.  [Golang handles TERM and INT signals itself, without
relying on the kernel's default
behaviour.](https://golang.org/pkg/os/signal/#hdr-Default_behavior_of_signals_in_Go_programs)
So those applications always shut down promptly when asked.

## Other possible solutions

Other than adding signal handlers to all of our applications, we could
instead use an init daemon such as
[dumb-init](https://github.com/Yelp/dumb-init), or since Docker 1.13
you can pass an '--init' flag to make docker run do something similar.
