---
author: Lance Wicks
layout: post
title: Perl, Pizza and a mere 44 builds
subtitle: Task::Biodiverse::NoGui - CPAN Pull Request Challenge, January 2017
tags: cpan perl cpan-prc travisci
---

This month (January 2017) the development team here at CV-Library joined the CPAN Pull Request Challenge and together we worked on [Task::Biodiverse::NoGui](https://metacpan.org/release/Task-Biodiverse-NoGUI). After having spent part of the month looking at the module and investigating we took the evening of January 25th and got together to work on the module.

It was a great evening, starting with an introduction to the history and structure of the challenge itself, then a little discussion (over pizza) about what contributions we could make. We identified two areas we could work on and got to work.

[![CV-Library Team](/images/prc1-team.jpg)](/images/prc1-team.jpg)

Some of us got to work with a Cpanfile to make installations simpler; which turned into integrating TravisCI. At CV-Library we make heavy use of continuous integration; so it was a natural fit for us to work on.

Another part of our team wanted to see the module at work, and started trying to install the module (and it's base project) on one of our PCs. This meant getting familiar with the pre-requisites (Fortran, no really Fortran) which was in fact closely related to what the rest of the team was doing.

[![BioDiverse screenshot](/images/prc1-biodiverse.jpg)](/images/prc1-biodiverse.jpg)

We emailed the author ([Shawn Laffan](https://metacpan.org/author/SLAFFAN)) of the module and even before we left for the night we had a reply (from Australia), which was a great boost and informed some of our efforts.

Of course getting TravisCI and the cpanfile configured "just right" took a little while ([44 builds!](https://travis-ci.org/cv-library/biodiverse/builds)) but taught us a lot about the module and it's dependencies. Many of team had not been directly involved in our internal CI project (we use Jenkins) so it was really valuable for our team to start a new CI integration and understand how much effort can go into it... and how nice it is that our automated test and build pipeline "just works".


The culture of CV-Library is to push early and often, so we pushed a cpanfile file commit and pull request. Which later was abandoned in favour of the TravisCI commit which superceeded it. We also prototyped a commit for the Author that gave the NoGui module it's own github repo (the module is currently bundled within another module).

After spending the evening together working on the module, some of us kept at it, lunchbreaks and evenings have included conversations and further commits. And four days later the auther accepted pull request #648 and CV-Library officially had it's first accepted pull request in the CPAN Pull Request Challenge 2017! Not bad for our very first module!

[![Pull Request Accepted!](/images/prc1-accepted.jpg)](/images/prc1-accepted.jpg)

In February we have been allocated [Git::Hooks](https://metacpan.org/pod/Git::Hooks), which is a module easier for us to get our teeth into perhaps as we use Git as our version control system.



