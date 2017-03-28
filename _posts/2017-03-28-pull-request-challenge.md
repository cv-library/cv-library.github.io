---
author: Lance Wicks
layout: post
title: CPAN Pull Request Challenge, March 2017
subtitle: XS, threading and tests For The Win
tags: cpan perl cpan-prc travisci git xs
---

Welcome to our third post about our development team's extra-curricular involvement in the [CPAN Pull Request Challenge](http://cpan-prc.org/).

This month we tackled: [Linux::Unshare](https://metacpan.org/pod/Linux::Unshare).


This module is a XS wrapper around a Linux system call, so it gave us a great opportunity to teach many of the team about XS and the role it plays in Perl. Most of the dev team have never looked deeply into a XS module, let alone tried to contribute to one.

We started the evening with a short talk on XS from one of the team to set the stage. We looked at the module itself and stepped through the actual lines of code one by one and discussed what we thought was happening and how that works when used in a perl script.


{% highlight perl %}

sub AUTOLOAD {
    my $constname;
    our $AUTOLOAD;
    ($constname = $AUTOLOAD) =~ s/.*:://;
    croak "&Linux::Unshare::constant not defined" if $constname eq 'constant';
    my ($error, $val) = constant($constname);
    if ($error) { croak $error; }
    {
        no strict 'refs';
        *$AUTOLOAD = sub { $val };
    }
    goto &$AUTOLOAD;
}

require XSLoader;
XSLoader::load('Linux::Unshare', $VERSION);

sub unshare_ns { return unshare(0x20000) ? 0 : -1; }

1;
__END__

{% endhighlight %}


Having learned a little about XS and the module people started exploring and pretty much immediately we found an issue.

When we tried to install the module on the PC we have connected to the big screen in the development area of the office; it would not install. Someone else tried it on their laptop and it intalled fine, which made us scratch our heads. Someone else was scouring the internet and discovered the outstanding [RT issue](https://rt.cpan.org/Public/Bug/Display.html?id=108556) which looked similar to what we encountered.


In parallel to this investigation two people had started setting up a TravisCI configuration and once the discovery of the RT issue had been shared, they were quickly able to configure Travis to test against threaded and non threaded perl versions. You can see in [build #2](https://travis-ci.org/cv-library/Linux-Unshare/builds/211491820) really clearly the problem is with threaded perl versions.

A third group of developers were investigating and had tracked the issue a bit deeper and discovered a blog post that helped further with diagnosis ( [fREW Schmidt's: https://blog.afoolishmanifesto.com/posts/perl-linux-namespaces-and-pedestrian-problems/](https://blog.afoolishmanifesto.com/posts/perl-linux-namespaces-and-pedestrian-problems/) ).

The problem we saw exhibited itself something like this:


{% highlight perl %}
Your vendor has not defined Linux::Unshare macro CLONE_NEWNS, used at t/Linux-Unshare.t line 22.
{% endhighlight %}

We checked the include files and sure enough, we certainly had those definitions on our disk.  In /usr/include/linux/sched.h and various other places on at least one of the machines.  Looking at the Unshare.xs file it included <sched.h> as you’d expect and everything appeared to be fine.  On some machines those definitions were behind some switches, but we realised that they were being correctly unlocked by the definition of _GNU_SOURCE before the include.

That led us to examine the mechanism that the definitions were provided in Perl.  This module is using [ExtUtils::Constant](https://metacpan.org/pod/ExtUtils::Constant) which appears to be a commonly used module that is well used and tested.  It gets you to link in a cont-c.inc and a const-xs.inc which are generated at build time.

The Makefile.PL contains the following snippet which generates the files with the constants you want to export,

{% highlight perl %}
 my @names = (qw(CLONE_THREAD CLONE_FS CLONE_NEWNS CLONE_SIGHAND CLONE_VM
	  CLONE_FILES CLONE_SYSVSEM CLONE_NEWUTS CLONE_NEWIPC CLONE_NEWNET CLONE_NEWUSER ));
  ExtUtils::Constant::WriteConstants(
                                     NAME         => 'Linux::Unshare',
                                     NAMES        => \@names,
                                     DEFAULT_TYPE => 'IV',
                                     C_FILE       => 'const-c.inc',
                                     XS_FILE      => 'const-xs.inc'
                                  );
{% endhighlight %}

The cont-c.inc is the actual file that ends up containing the constants.  They are wrapped up in #ifdef’s though which means that if they aren’t present on the machine where the code is being compiled, it won’t be a build error.  Instead the switch statement to look up the values will end up at the default case and return not found, producing the run time error we were seeing.

{% highlight perl %}
#ifdef CLONE_NEWNET
      *iv_return = CLONE_NEWNET;
      return PERL_constant_ISIV;
#else
      return PERL_constant_NOTDEF;
#endif
{% endhighlight %}

Now we went back to the Unshare.xs and realised that the const-c.inc file was included before sched.h.  Moving it below fixed the problem.

We pushed this change and TravisCI turned a nice shade of green! ([Build #6](https://travis-ci.org/cv-library/Linux-Unshare/builds/212312534))

The change to Unshare.xs that made it all work ended up being very small indeed:


[![Unshare.xs](/images/march-2017-unshare_xs.png)](/images/march-2017-unshare_xs.png)


Our pull requests are [here](https://github.com/hackman/Linux-Unshare/pull/6) on the modules github repository.

The next module will be assigned to us on April 1st, we are hoping for something fun, but please [Neil](http://neilb.org/), no April Fools suprises! ;-)
