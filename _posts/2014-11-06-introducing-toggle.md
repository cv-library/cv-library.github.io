---
layout: post
title: "Introducing Toggle"
author: katherine 
tags: 
---

Long lived difficult to merge feature branches, features that behave differently on staging to production and risky deployments are all things that we at [CV-Library](http://www.cv-library.co.uk/) like to avoid :) 

In order to make life easier for ourselves, we wrote [Toggle](https://metacpan.org/pod/distribution/Toggle).

> **Attending the London Perl Workshop (LPW 2014)? Be sure to see [Tim Retout's talk] (http://act.yapc.eu/lpw2014/talk/5734) to learn more about using Toggle.**

Toggle.pm is based on [James Golick's Ruby "rollout" library](https://github.com/FetLife/rollout).

By allowing you to store feature flags in a database of your choice (it works particularly well with [Redis](http://redis.io/), but just needs to be an object that supports get(), set() and del() on a key) it makes it very easy to expose a UI to the state of deployment and also to enable or disable features in real time without requiring a redeployment.

**_Enough talking, show me the toggling!_**

Say we have a shiny new feature to add to our job search. We'll call it  "job_search_NG" and we want to roll out for staff testing before a general deployment.

First we set up our storage and Toggle objects as global variables available to the whole application.

{% highlight perl %}
use Redis;
use Toggle;
    
my $redis = Redis->new;
my $toggle = Toggle->new( storage => $redis );
{% endhighlight %}

Then we define who we mean by "staff". In this case, it's for logged in users only, so we can check our permissions. The $user object must have an id accessor.

{% highlight perl %}
$toggle->define_group( staff => sub {
    my $user = shift;
    return $user->has_role('staff');
});
{% endhighlight %}

Now the feature needs to be activated and enabled.

Activate for our staff group (directly or via a management UI):

{% highlight perl %}
$toggle->activate_group( job_search_NG => 'staff' );
{% endhighlight %}

Enable the feature in the controller:

{% highlight perl %}
if ( $toggle->is_active( job_search_NG => $user) ) {
    # Show this user the shiny new feature
} else {
    # Show existing feature
}
{% endhighlight %}

All seems fine, so now we want to share it with a particular user who isn't staff:

{% highlight perl %}
$toggle->activate_user( job_search_NG => $user );
{% endhighlight %}

Horray, we have a go from the UX team. Let's start a rollout to 25% of our users:

{% highlight perl %}
$toggle->activate_percentage( job_search_NG => 25 );
{% endhighlight %}

In the event of a problem, then this is all it takes to reduce the percentage in the rollout to 0:

{% highlight perl %}
$toggle->deactivate_percentage( 'job_search_NG' );
{% endhighlight %}

And once we're satisfied the rollout is a success, we remove the check from the controller and the old feature from the code base.

See the [POD](https://metacpan.org/pod/distribution/Toggle/lib/Toggle.pod) for more use cases. 

Get Toggle on [GitHub](https://github.com/cv-library/Toggle) or [CPAN](https://metacpan.org/release/Toggle).

Coming soon, our use of detailed statsd and graphite monitoring to to catch regressions in deployments.
