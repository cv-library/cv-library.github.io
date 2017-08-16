---
author: Lance Wicks
layout: post
title: The pull request to pizza ratio
subtitle: Git::Hooks - CPAN Pull Request Challenge, February 2017
tags: cpan perl cpan-prc travisci git
---

Last month the development team here at CV-Library embarked on the [CPAN Pull Request Challenge](http://cpan-prc.org/) and this month we tackled our second module: [Git::Hooks](https://metacpan.org/pod/Git::Hooks).

Members of our development, QA, operations and support teams participated, staying after work and creating four different pull requests.

[![February Pull Requests](/images/Pull-Requests-gnustavo-Git-Hooks.png)](/images/Pull-Requests-gnustavo-Git-Hooks.png)

The first pull request to hit GitHub was a change from the authors to-do list; which was to use the [Test::Requires::Git](https://metacpan.org/pod/Test::Requires::Git) module in the test suite. Using this module allowed us to simplify the test code from:

{% highlight perl %}
 SKIP: {

     try {
         $repo->command(['check-mailmap' => '<joe@example.net>'], {STDERR => 0});
     } otherwise {
         skip "test because the command git-check-mailmap wasn't found", 4;
     };
{% endhighlight %}

to:

{% highlight perl %}
SKIP: {
    test_requires_git skip => 4, version_ge => '1.8.5.3';
{% endhighlight %}

Next we added some small changes to the main POD, to make finding the tutorial and to-do lists easier to find. This was done as at first we totally missed the to-do list (until the author ([Gustavo](https://metacpan.org/author/GNUSTAVO)) emailed us telling us about the TODO file). This commit was done with a perl developer and one of our non-developers which was a great introduction to POD.

The third pull request was adding a Travis configuration to automate the testing of changes pushed to GitHub. This module uses [Dist::Zilla](https://metacpan.org/pod/Dist::Zilla) so it was a different flow to last month's module and a great opportunity to introduce some people to dzil commands and how they are used by module authors.

{% highlight yaml %}
sudo: required
language: "perl"
perl:
  - '5.24'
  - '5.22'
  - '5.10'
os:
  - "linux"
before_install:
  - sudo apt-get install libaspell-dev
  - cpanm Text::Aspell
  - cpanm --quiet --notest --skip-satisfied Dist::Zilla
install:
  - "dzil authordeps          --missing | grep -vP '[^\\w:]' | xargs -n 5 -P 10 cpanm --quiet --notest"
  - "dzil listdeps   --author --missing | grep -vP '[^\\w:]' | cpanm --verbose"
script:
  - dzil smoke --release --author
{% endhighlight %}

Finally, we took another item from the module author's to-do list and converted a script containing subs used in tests, to be a module. This meant turning the script into a module and rather than "requiring" the file we "include" it. So each of the test files needed a change like this:

{% highlight diff %}
-BEGIN { require "test-functions.pl" };
+use Git::Hooks::Test qw/:all/;
{% endhighlight %}

One commit worked on (but that didn't make it to fruition as a pull request) was the to-do item for Windows support. This was really interesting as we were fortunate to have our desktop support manager attend, who supports CV-Library's desktop environment which outside of the development team is primarily Windows.

Unlike last month, we did a bit of "sprint planning" in advance. We even had a burndown chart of pull requests to pizza slices consumed :-)

[![Pizza to Pull Request Burndown Chart](/images/feb-pizza-to-pull-requests-chart.jpg)](/images/feb-pizza-to-pull-requests-chart.jpg)

The process of working on the challenge brought to light new ideas both for the veterans in our team and the new members. Only a subset of our team currently have modules on CPAN, so encountering Dist::Zilla was really educational for some of the team and the work on porting the script to a module was really informative. The group of people working on the Travis configuration were very pleased that the process was comparatively easy compared to the dependency problems we encountered last month. After getting it working, we were able to expand it to use Dist::Zilla as which means that the author has all the dzil tests automated now.


Now the team has to wait for a couple of weeks before the next module is announced; we have provisionally scheduled in March 15th for the next evening event, so expect a blog post shortly after that date.


We were really pleased when Gustavo looked at our pull requests and has now accepted them all, with some really great comments. Thanks Gustavo!


