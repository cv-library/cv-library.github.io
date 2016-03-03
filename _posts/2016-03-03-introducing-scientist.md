---
author: Lance Wicks
layout: post
title: Introducing Scientist
subtitle: We're going to try science
tags: cpan perl perl6
---
Refactoring code is a necessity in any codebase; doing it safely is hard (though easier with tools like [Toggle](https://metacpan.org/pod/distribution/Toggle)). We often want to compare and contrast one solution against another and make sure that, not only do we get the same answers, we get the same (or better) performance. At CV-Library we have encountered this many times and found many one-off solutions to the problem.

Recently, we were [inspired](http://githubengineering.com/scientist/) by the GitHub [Scientist (Ruby)](https://github.com/github/scientist) project to write a generic solution, and so [Scientist (Perl5)](https://metacpan.org/pod/Scientist) got written and added to CPAN along with it's plucky little sister [Scientist (Perl6)](http://modules.perl6.org/?q=Scientist) available via Panda/Zef for the Perl6 community.

Scientist allows you to compare two pieces of code produce identical results and is designed to run safely in production. The candidate code is called inside an eval block to protect against it die-ing. It also provides timing information on both. Scientist always returns the result of the control (existing) code so adding a Scientist experiment to your live code should never affect the result. Currently, it's ideal for getters. Setters (or code with side effects) are not ideal as you do things twice.

The real value in Scientist is when you create your own personal publish() method.

For example, here at CV-Library we like to chart things (see the LPW2014 talk "[Feature Toggles and Graphs](http://act.yapc.eu/lpw2014/talk/5734)"). So when we extended Scientist with our own CV-Library::Scientist module we told it to push the timing information of experiments to Statsd. This way every experiment any one of our developers creates will be published automatically to Statsd with zero setup.

Below is an example of how you might do just that:

{% highlight perl %}
# MyPersonal/Scientist.pm
package MyPersonal::Scientist;

use parent 'Scientist';
use strict;
use warnings;

use Net::Statsd;

sub publish {
    my $exp = ( my $result = shift->result )->{experiment};

    # Round to the nearset millisecond.
    my $control   = int $result->{control}{duration} * 1_000 + .5;
    my $candidate = int $result->{candidate}{duration} * 1_000 + .5;

    my $status = ( 'mis' x $result->{mismatched} ) . 'matched';

    # Increment counter for every match or mismatch.
    Net::Statsd::inc( "experiment.$exp.$status" );

    # Log timings.
    Net::Statsd::timing("experiment.$exp.control",   $control);
    Net::Statsd::timing("experiment.$exp.candidate", $candidate);
}

1;
{% endhighlight %}

{% highlight perl %}
# some_perl_script.pl
use strict;
use warnings;

use My::Scientist;

my $experiment = MyPersonal::Scientist->new(
     experiment => 'Test_the_new',
     use        => \&old_get_info,
     try        => \&new_get_info,
);

my $result = $experiment->run;
{% endhighlight %}

With the above code in place, every time SomePerlScript.pl is run your Statsd server will be updated with counters for matched or mismatched and timing info for both paths.

In the office, we have started using Scientist within code we are working on where we are re-wiring parts of the codebase to use more modern design ideas and it has been helpful already in identifying subtle bugs where some variant of the parameters creates different results. The timing information has also been useful to us to remove concerns that the new code performs better than the old code.

The Perl5 module on CPAN is a fairly "barebones" ([MVP](https://en.wikipedia.org/wiki/Minimum_viable_product)) version of what the GitHub Ruby implementation can do at this stage. The module has been developed by a couple of our developers, and contributions are welcomed/invited from the wider Perl community.  We would very much like to hear from other people using the module or interested in expanding the functionality with us.

Read more:

* [Scientist on MetaCPAN](https://metacpan.org/pod/Scientist)
* [Scientist Git Repo](https://github.com/lancew/Scientist)
* [Report Issues with Scientist](https://github.com/lancew/Scientist/issues)
