---
author: Lance Wicks
layout: post
title: CPAN Pull Request Challenge, May 2017
subtitle: App::AltSQL
tags: cpan perl cpan-prc mysql
---

Welcome to our fourth post in our series of monthly posts about our development team's extra-curricular involvement in the [CPAN Pull Request Challenge](http://cpan-prc.org/).

This month we tackled: [App::AltSQL](https://metacpan.org/release/App-AltSQL).


App::AltSQL is an alternative command line client to SQL databases, it can be used as a replacement for connecting to mysql like so:

```
mysql -h <host> -u <username> -D <database> -p<password>
```

becomes

```
altsql -h <host> -u <username> -D <database> -p<password>
```

[![AltSql screenshot](/images/altsql_screenshot.jpg)](/images/altsql_screenshot.jpg)

Rather than the ASCII art interface you are used to, you get a nicer output as per the screenshot above. It also allows via the same client access to mysql, sqlite3, sql and infact any database that has a Perl DBI driver. This month we has some of our team start using the module on their development PCs before the challenge evening and finding the module was helpful in their day to day work. So being assigned this module has been a great find of a new dev tool we can use day to day.

As some of the team had started using the module before the challenge we walked into this one with a new feature idea, and we were able to implement it and make a pull request with relative speed and ease. This month some of the participants who are not in the Perl development team worked with the Perl developers and achieved the goal of making a pull request.


[![Merge requests](/images/Commits_ewaters_altsql_shell.png)](/images/Commits_ewaters_altsql_shell.png)

Along with a new feature we were able to imporove the testing code around the module. Both fixing some tests that had some problems and also extending the functionality and flexibility of the tests also. We resolved some small behavioral issues in some edge cases as well.

{% highlight perl %}
use strict;
use warnings;
use Test::More;
use Test::Deep;
use App::AltSQL::Model;

ok my $model = App::AltSQL::Model->new(app => 1);

is $model->is_end_of_statement('test'), 0, 'Incomplete statement';
is $model->is_end_of_statement('test;'), 1, 'Semicolon completes statement';
is $model->is_end_of_statement('quit'), 1, 'quit statement';
is $model->is_end_of_statement('exit'), 1, 'exit statement';
is $model->is_end_of_statement('   '), 1, 'blank space statement';
is $model->is_end_of_statement('test\G'), 1, '\G statement';
is $model->is_end_of_statement('test\c'), 1, '\c statement';
is $model->is_end_of_statement('select * from film where title = ";'), 0, 'Semi colon in string';
is $model->is_end_of_statement(qq{select * from film where title = ";\n";}), 1, 'Tail end of statement where we were in a string';
is $model->is_end_of_statement('insert into mytab values (";",'), 0, 'Incomplete statement';
is $model->is_end_of_statement(q{select * from film where title = '\';}), 0, 'Semi colon in string';
is $model->is_end_of_statement(q{select * from film where title = "\";}), 0, 'Semi colon in string';
is $model->is_end_of_statement(q{select * from film where title = "\\\\";}), 1, 'Escaped slash, terminated string and end of statement';
is $model->is_end_of_statement(q{select * from film where title = /* "\";}), 0, 'Semi colon in comment';
is $model->is_end_of_statement(qq{select * from film where title = /* "\";\n*/ 'test';}), 1, 'Statement terminated after comment closes';
is $model->is_end_of_statement(q{select 'test'; -- a simple statement}), 1, 'Statement terminated Got a comment after';
is $model->is_end_of_statement(qq{select 'test' -- a simple statement\n;}), 1, 'Statement with -- comment terminated on next line';

done_testing;
{% endhighlight %}


The author [Eric Waters](https://metacpan.org/author/EWATERS), was really communicative and enthusiastic towards our efforts which was great and helped make this one of the most energetic evenings we have had this year... alternatively it could have been the radical decision to have Chinese food rather than Pizza!


[![Chinese Food](/images/chinese_food.jpg)](/images/chinese_food.png)


See you next month!
