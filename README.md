uuid-quick
==========
[![Build Status](https://api.travis-ci.org/andrasq/node-uuid-quick.svg?branch=master)](https://travis-ci.org/andrasq/node-uuid-quick?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/andrasq/node-uuid-quick/badge.svg?branch=master)](https://coveralls.io/github/andrasq/node-uuid-quick?branch=master)

Quicker UUIDs.

My try at nudging the state of the art past the 1 million UUIDs per second barrier.


Summary
-------

    const uuid = require('uuid-quick');
    let id = uuid();

Speed:

    $ node benchmark.js

    qtimeit=0.21.0 node=10.15.0 v8=6.8.275.32-node.45 platform=linux kernel=4.9.0-0.bpo.4-amd64 up_threshold=false
    arch=ia32 mhz=4182 cpuCount=8 cpu="Intel(R) Core(TM) i7-6700K CPU @ 4.00GHz"
    name               speed           rate
    uuid             423,440 ops/sec    212 >
    node-uuid        422,849 ops/sec    211 >
    fast-uuid        767,277 ops/sec    384 >>
    uuid-quick     2,103,027 ops/sec   1052 >>>>>
    mongoid-js    24,542,177 ops/sec  12271 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


Api
---

### uuid( )

The `uuid-quick` package exports a function that returns Version 4 UUID strings.  These are 32
random hexadecimal characters separated by 4 dashes `-` in the form
"11111111-1111-4111-8111-111111111111", where "1" is a hex digit, "4" is the letter '4', and "8"
is one of '8', '9', 'a' or 'b'.

    const uuid = require('uuid-quick');
    let id = uuid();

### uuid.v4( )

same as `uuid()`

### uuid.uuid( )

same as `uuid()`

### uuid.rand

the random number generator function to use.  By default this property is set to `Math.random`.
Must return floating-point values between 0 and 1 with at least 36 bits of precision.


Changelog
---------

- 0.1.0 - first version


Related Work
------------
