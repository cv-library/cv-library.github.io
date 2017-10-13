---
author: Colin Newell
layout: post
subtitle: Test2::Suite
title: An early start on October's pull request challenge
tags: perl cpan cpan-prc
---

This month we’re going to be working on the [Test2::Suite](https://metacpan.org/pod/Test2::Suite) module for the pull request challenge.  Normally we confine most of the work until we all get together and do the majority of it that evening.  While commonly we’ll take a brief look before hand, this time I’ve already submitted a pull request and had it merged because the timing also coincided with a problem I encountered myself.

After using Test2 directly in production I had decided to switch one of my own CPAN modules over to using it directly too.

> As part of that I sorted out my shocking lack of test coverage and hooked in [Travis](http://travis-ci.org/) and [Coveralls](https://coveralls.io).  While I had been aware of Travis et al., pretty much since their inception, I had never used it myself.  I had assumed it would require something like a Dockerfile to get going initially, which while not massively onerous to construct, was more than I felt like doing.  While working on the PRC I saw that the typical Perl project’s travis file was actually really simple, largely just including a list of perl versions to test against.  Thanks to the helper scripts at [https://github.com/travis-perl/helpers](https://github.com/travis-perl/helpers) it’s really simple to wire in and add coveralls support too.  Another reason I had avoided it was the existence of CPAN Testers.  With the comprehensive testing on so many platforms, how was that different to what Travis was doing?  It turns out one of the big benefits is the way it’s triggered when a pull request from a third party comes in.  That allows both the maintainer and the contributor to get an early idea of whether any tests are broken.  With the integration of services like Coveralls it also gives an idea of whether the new code is tested, and gives an extra nudge to add tests if none have been created yet.


Converting was simple, but once I released a new version I started getting [strange failures](http://www.cpantesters.org/cpan/report/c248d720-a9dd-11e7-a074-e1beba07c9dd) on 5.10.0 reported by [CPAN Testers](http://cpantesters.org/).

    t/live-query.t       (Wstat: 11 Tests: 5 Failed: 0)
     Non-zero wait status: 11


Since we had Test2 to do for our Pull Request Challenge I had been paying attention to its issues and I realised that one of them resembled my issue.  I was using [Test2::V0](https://metacpan.org/pod/Test2::V0) which brings in a whole bundle of modules from Test2::Suite, including the [UTF8](https://metacpan.org/pod/Test2::Plugin::UTF8), and I was definitely using the mocking too.


> [Segfault on Perl 5.10.0 with Test2::Plugin::UTF8 + subtest + Test2::Mock #129](https://github.com/Test-More/Test2-Suite/issues/129)


I started by running my test locally and having a look at the stack trace in GDB.  This showed that the crash was utf8 related, and there was also indications of a regex being involved.  The crash was a null pointer dereference.  

    Program received signal SIGSEGV, Segmentation fault.
    0x000055555561e6ad in S_swash_get ()
    (gdb) bt
    #0  0x000055555561e6ad in S_swash_get ()
    #1  0x0000555555620eb0 in Perl_swash_fetch ()
    #2  0x0000555555613642 in S_regrepeat ()
    #3  0x0000555555617993 in S_regtry ()
    #4  0x000055555561e14d in Perl_regexec_flags ()
    #5  0x00005555555c4bda in Perl_pp_match ()
    #6  0x00005555555c116d in Perl_runops_standard ()
    #7  0x00005555555bc45e in Perl_call_sv ()
    #8  0x00005555555cd98a in Perl_sv_clear ()
    #9  0x00005555555ce0f8 in Perl_sv_free2 ()
    #10 0x00005555555ca227 in S_visit ()
    #11 0x00005555555ca811 in Perl_sv_clean_objs ()
    #12 0x00005555555bd38c in perl_destruct ()
    #13 0x000055555557c280 in main ()

      0x000055555561e69a <+234>:        mov    $0x20,%r9d
      0x000055555561e6a0 <+240>:        mov    $0x6,%ecx
      0x000055555561e6a5 <+245>:        mov    %rax,%rbx
      0x000055555561e6a8 <+248>:        callq  0x5555555b5b00 <Perl_hv_common>
    => 0x000055555561e6ad <+253>:        mov    (%r12),%rdi
      0x000055555561e6b1 <+257>:        mov    %rax,0x68(%rsp)
      0x000055555561e6b6 <+262>:        pop    %rsi

At that point r12 is 0

    r12            0x0        0

If you grep the Perl source code you can see that the `S_swash_get` function is in the utf8 code, and `Perl_regexec_flags` is part of the regex processing. The `perl_destruct` suggests this was occurring when a destructor was firing.

While I was working on my own tests that crashed, all those indicators suggested this was the original issue I was likely reproducing, so I proceeded to add notes to that issue on github and then carried on to narrow down the problem.

In truth the stack trace didn’t help too much.  Even if this is a bug in Perl (and I assume it is), it won’t really help to fix it since this is a long past version of Perl, and the bug has presumably already been fixed as we don’t encounter the crash in any other version.

Turning my attention to the perl I discovered there was a [DESTROY method](https://github.com/Test-More/Test2-Suite/blob/master/lib/Test2/Mock.pm#L454) in the Test2::Mock and if I commented out the contents that stopped the segfault.  

I started using the debugger adding a breakpoint using `$DB::single = 1`, but debugging in the destructor is tricky, so I ended up resorting to print statements to isolate the problematic line.  The break point would only fire after the debugger had said the script had finished, after I told it to quit.  Then trying to step onto the next line would actually exit the script.

The print statements allowed me to zero in on the regex in [Test2::Util::Stash](https://github.com/Test-More/Test2-Suite/blob/master/lib/Test2/Util/Stash.pm#L61).

    my ($sig, $pkg, $name) = ($symbol =~ m/^(\W?)(.*::)?([^:]+)$/)
       or croak "Invalid symbol: '$symbol'";

Now I placed a breakpoint in the debugger and took a closer look using Devel::Peek.


*Early on when the script is starting up,*

     DB<4> Dump($symbol)
    SV = PV(0x555ec68b3808) at 0x555ec5ca1708
     REFCNT = 2
     FLAGS = (PADMY,POK,pPOK,UTF8)
     PV = 0x555ec688ec40 "&request"\0 [UTF8 "&request"]
     CUR = 8
     LEN = 16

     DB<5> x $symbol =~ m/^(\W?)(.*::)?([^:]+)$/
    0  '&'
    1  undef
    2  'request'

*Then when the destructor is invoked,*

     DB<6> Dump($symbol)
    SV = PVMG(0x555ec69fe240) at 0x555ec5ca1708
     REFCNT = 2
     FLAGS = (PADMY,POK,pPOK,UTF8)
     IV = 0
     NV = 0
     PV = 0x555ec5dcbfe0 "&request"\0 [UTF8 "&request"]
     CUR = 8
     LEN = 16

     DB<7> x $symbol =~ m/^(\W?)(.*::)?([^:]+)$/
    Signal SEGV at /home/colin/perl5/perlbrew/perls/perl-5.10.0/lib/5.10.0/perl5db.pl line 638
            DB::eval called at /home/colin/perl5/perlbrew/perls/perl-5.10.0/lib/5.10.0/perl5db.pl line 3434
            DB::DB called at /home/colin/perl5/perlbrew/perls/perl-5.10.0/lib/site_perl/5.10.0/Test2/Util/Stash.pm line 63
            Test2::Util::Stash::_parse_symbol('Test2::Mock', '&request', 'REST::Client') called at /home/colin/perl5/perlbrew/perls/perl-5.10.0/lib/site_perl/5.10.0/Test2/Util/Stash.pm line 45
            Test2::Util::Stash::parse_symbol('&request', 'REST::Client') called at /home/colin/perl5/perlbrew/perls/perl-5.10.0/lib/site_perl/5.10.0/Test2/Mock.pm line 394

The breakpoint actually fired early on and you could see the code working, before later it failed.

While there is an obvious difference between the variable at the start and end, this doesn’t really feel like a bug in Test2.  This is more likely in Perl.  Except this is an older version of Perl, and the crash doesn’t occur in the next version, so presumably that was fixed, so attempting to fix the bug in Perl is pointless.  The best we can do is work around the problem.  To that end I tried a `utf8::downgrade` to prevent the crash.  Sure enough that seemed to prevent the issue.  I couldn’t see any particular reason that utf8 should be important at this point, so that seems like a reasonable work around for 5.10.0.  There we have our first pull request for the month. 

The test came from the original bug report and just makes use of [Test2::Require::Module](https://metacpan.org/pod/Test2::Require::Module) to ensure it only runs if the module it’s mocking is available.  With the addition of a condition to limit the scope of the change to just that version of Perl we had our first pull request accepted.

Huge thanks to [Chad Granum](https://metacpan.org/author/EXODIST) for being responsive and his suggestions to add the conditional bits to ensure everything fits in smoothly.

