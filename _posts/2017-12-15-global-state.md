---
author: Tim Retout
layout: post
title: Global state
subtitle: 
tags: perl testing advent-2017
---

*Part fifteen of [a series of posts about automated
 testing](https://tech-blog.cv-library.co.uk/tags/#advent-2017-ref).*

Global state can cause problems with testing.

{% highlight perl %}
package Santa::Counter;

# Global state!
our $presents_delivered = 0;

sub increment {
    $presents_delivered++;
    return $presents_delivered;
}

1;
{% endhighlight %}

Each time this is called from tests, the result will be different:

{% highlight perl %}
sub counter_should_return_one {
    is(increment(), 1);
}

sub some_other_test {
    # accidentally calls increment()...
}
{% endhighlight %}

Depending on the order these tests get run, one will fail.

The answer is to change the code to avoid global state, and then the
code can be initialized correctly for the tests.

## Further reading

- [Google Testing: Global State and Singletons](https://testing.googleblog.com/2008/11/clean-code-talks-global-state-and.html)
