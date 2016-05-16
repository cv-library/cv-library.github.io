---
author: Maciej Dziardziel
layout: post
title: Rust in production
tags: rust python
---


This post was created to describe our experience with rewriting part of python app in rust and deploying it to production.
The app we discuss here is responsible for analysing job text to determine categories where it should belong
- every job posted at cv-library.co.uk went through it, and we are using this data to improve site navigation and search result.
I hope to accurately describe pains and gains of using rust and perhaps motivate its developers to fix some of issues we faced :-)

Lets start with end result: this graph presents average response time after switching from python to rust:

You can see significant reduction of processing time and elimination of large occasional spikes. Pure win.

Why rust?

We've created python app to figure out how to approach text classification and it did good job in this area - the way we do this turned out to meet our initial requirements, and python had no problem with keeping up with analyzing job titles. However when we decided to also use job description, it was time to replace it with something faster.

Among considered options was pypy and golang, but it turned out that both have their issues that make less then perfect candidates. Pypy is perhaps good for number crunching, but less so for anything else, and we didn't want to compromise code structure to satisfy its whims. Attempting to do so would mean major rewrite and reduced readability with no guarantee of sufficient speed improvement. Go looked like passable choice that can meet all functional requirements, until we started looking at its libraries and their reported issues - errors caused by availability of nil and interface{}, lack of solid type system guarantees and other easily avoidable problems are not uncommon, and its not something that we want to deal with in production. Generics accessible only for builtin magical functions do not help it either. With stable version available for a while, rust became viable contender, providing excellent type system with no need for escape hatches, lack of null-pointer issues, guaranteed utf8 validations (We are dealing with text and care about that very seriously), ability to c-compatible libraries and easy way of writing highly concurrent applications. So rust maybe, but...

Does it have all the libraries we need?

Short answer - it does. The requirement list wasn't very long: we have to access database, parse textual data, stem it, and provide simple webservice. [Mysql driver](https://github.com/blackbeam/rust-mysql-simple),  [lalrpop](https://github.com/nikomatsakis/lalrpop) and [iron](https://github.com/iron/iron) provided almost all of that, the only missing part was stemmer, but rewriting NLTK wordnet implementation [wasn't a big deal](https://github.com/Fiedzia/wordnet_stemmer). I would really like to emphasize quality of rust libraries - the laser focus this language designer had on writing correct code results in surprisingly error-free libraries, even if they are very young. Its truly refreshing after dealing with a lot of c/c++ code where frequent discovery of critical bugs is a norm rather then exception.

What about concurrency?

One of problems we had to solve was to have webserver where multiple threads read complex datastructure, and separate thread writes to it periodically. Its not terribly complex problem, but getting it right at first attempt is still an achievement.
So far its been running flawlessly for months and that's really encouraging.

How it works live?

Deploying rust is one aspect where thing sometimes do not work as expected, and the only reason in my opinion is that library authors do not always have devops experience. Things that annoyed us include:

1. Lack of ability to define connect timeout for sockets - if you try to connect to wrong host/port, the app will just hang. This is stdlib broken socket design and in practice forces developers to fix separately every library that use sockets. I can easily see it as dealbreaker for many cases, since discovering that this is a problem and how to fix it requires networking and system knowledge many developers don't have. Stdlib authors do not want this code because it must be os-specific, network-library authors think it belongs in socket module, higher-lever library authors don't understand networking/os interactions, sysadmins and end-users will curse all of them a lot.

2. Iron as a webframework works well and does its job. Its not django or rails, but we had no issues.
Iron-logging middleware though is provided in the core: you may think its official logger, and yet [it works only interactively](https://github.com/iron/logger/issues/78). A message to its authors: daemons are not running connected to terminals.
This one was frustrating because any other error would be simply logged and immediately visible, but if your logging is broken, life gets hard fast. Writing own logging middleware took 10 lines, but I really would expect such official projects to work flawlessly.

3. If you try to open a file that does not exist, you'll get file not found error. But it will not inform you WHICH file does not exist. Now you'll have to either wrap this error everywhere (whack-a-mole game in any non-trivial project), figure it out from code (if you have traceback enabled) or rerun the app under strace. Can this be fixed, please?

Summary:

Despite small issues, we've come to like rust more and more. The level of code correctness it achieves by default beats all languages we've been working with so far. Null-pointer errors, type errors and memory errors are thing of the past. Resulting code is FAST. What we wish for is that its authors stopped adding compiler features for a week (however useful they are), wrote simple webservice and ensure that it works. A week later we all would have absolutely perfect tool :-)
