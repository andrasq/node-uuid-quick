uuid-quick
==========
[![Build Status](https://api.travis-ci.org/andrasq/node-uuid-quick.svg?branch=master)](https://travis-ci.org/andrasq/node-uuid-quick?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/andrasq/node-uuid-quick/badge.svg?branch=master)](https://coveralls.io/github/andrasq/node-uuid-quick?branch=master)

Quicker fast UUIDs.

My try at nudging the state of the art past the 1 million UUIDs per second barrier.

RFC at https://tools.ietf.org/html/rfc4122


Overview
--------

    const uuid = require('uuid-quick');
    let id = uuid();

`uuid-quick` is a fast Version 4 (random) UUID generator (see RFC Section 4.4, page 14).
The new version 0.2.0 is almost twice as version 0.1.0 was.

    $ node benchmark.js

    qtimeit=0.21.0 node=10.15.0 v8=6.8.275.32-node.45 platform=linux kernel=5.5.0-1-amd64 up_threshold=false
    arch=ia32 mhz=4482[os] cpuCount=16 cpu="AMD Ryzen 7 3800X 8-Core Processor"
    name               speed           rate
    uuid             277,767 ops/sec   1000 >>
    node-uuid        304,581 ops/sec   1097 >>
    fast-uuid        871,343 ops/sec   3137 >>>>>>
    uuid-quick     4,892,916 ops/sec  17615 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

If only uniqueness is needed, then a good sequential id generator like e.g. `mongoid-js` can be
much faster than even the fastest uuid.  This speed difference is inherent in UUID's, they have to be
random at avery position; sequential generators have redundancies that can be optimized out.

    qtimeit=0.21.0 node=10.15.0 v8=6.8.275.32-node.45 platform=linux kernel=5.5.0-1-amd64 up_threshold=false
    arch=ia32 mhz=4480[os] cpuCount=16 cpu="AMD Ryzen 7 3800X 8-Core Processor"
    name                     speed           rate
    uuid-quick           4,961,158 ops/sec   1000 >>
    mongoid-js short    34,117,176 ops/sec   6877 >>>>>>>>>>>>>>


API
---

### uuid( )

The `uuid-quick` package exports a function that returns Version 4 UUID strings.  These are 32
random hexadecimal characters separated by 4 dashes `-` grouped 8-4-4-4-12 in the form
"11111111-1111-4111-8111-111111111111", where "1" is a hex digit, "4" is the letter '4', and "8"
is one of '8', '9', 'a' or 'b'.  (I said 32, but careful readers will note that there are
actually only 30.5 random hex characters, the other 6 bits of the 32 chars are constant.)

    const uuid = require('uuid-quick');
    let id = uuid();

### uuid.v4( )

same as `uuid()`

### uuid.uuid( )

same as `uuid()`

### uuid.rand

the random number generator function to use.  By default this property is set to `Math.random`.
Must return floating-point values between 0 and 1 with at least 48 bits of precision.


Changelog
---------

- 0.2.0 - rewrite, now 2x faster
- 0.1.0 - first version


Related Work
------------

- [mongoid-js](https://npmjs.com/package/mongoid-js) - extremely fast unique string id generator
