---
author: Tim Retout
layout: post
subtitle: a.k.a. Given, When, Then
title: Arrange, Act, Assert
tags: perl testing advent-2017
---

*Part six of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

There is a guideline for structuring individual unit tests, known as
"Arrange, Act, Assert".  The idea is, most tests should be structured
in this manner:

{% highlight perl %}
sub one_plus_one_should_give_two : Test {
    # Arrange
    my $calc = Calculator->new();

    # Act
    my $result = $calc->run("1 + 1");

    # Assert
    is($result, 2);
}
{% endhighlight %}

That is, these steps are clearly separated, and there is usually a
single assertion at the end.

When more than one test has a similar "Arrange" step, it is often
possible to factor out a setup method:

{% highlight perl %}
sub setup : Test(setup) {
    shift->{calc} = Calculator->new();
}

sub one_plus_one_should_give_two : Test {
    my $result = shift->{calc}->run("1 + 1");

    is($result, 2);
}
{% endhighlight %}

In general, it can be useful to shorten tests by writing helper
methods for common boilerplate steps.  This maximizes the
signal-to-noise ratio of the test itself - you see just the condition,
and the assertion.

There are potentially some exceptions to the idea that you have one
assertion per test.  For example, tests which specifically exercise
changes in state:

{% highlight perl %}
my ($user, $srv);
sub setup : Test(setup) {
    $user = User->new();
    $srv = LoginService->new( db => get_db() );
}

sub three_failed_login_attempts_should_lock_account : Test {
    $srv->login( $user, get_invalid_password() );
    is( $srv->is_account_locked( $user ), 0 );
    $srv->login( $user, get_invalid_password() );
    is( $srv->is_account_locked( $user ), 0 );
    $srv->login( $user, get_invalid_password() );
    is( $srv->is_account_locked( $user ), 1 );    
}
{% endhighlight %}

The key is to have [one test per
behaviour](https://tech-blog.cv-library.co.uk/2017/12/05/one-test-per-behaviour/).

## Further reading

- [Bill Wake: Arrange, Act, Assert](https://xp123.com/articles/3a-arrange-act-assert/)
- [Martin Fowler: Given, When, Then](https://martinfowler.com/bliki/GivenWhenThen.html)