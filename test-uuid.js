'use strict';

var uuid = require('./');

module.exports = {
    'package': {
        'should export expected properties': function(t) {
            t.equal(typeof uuid, 'function');
            t.equal(typeof uuid.uuid, 'function');
            t.equal(typeof uuid.v4, 'function');
            t.equal(uuid.v4, uuid.uuid);
            t.equal(uuid.rand, Math.random);
            t.done();
        },
    },

    'uuid_4': {
        'should generate a 36-byte string': function(t) {
            var id = uuid();
            t.equal(typeof id, 'string');
            t.equal(id.length, 36);
            t.done();
        },

        'should generate distinct ids': function(t) {
            var ids = [];
            for (var i=0; i<10000; i++) ids.push(uuid());
            ids.sort();
            for (var i=1; i<10000; i++) t.ok(ids[i] != ids[i-1]);
            t.done();
        },

        'ids should not have many shared bytes': function(t) {
            for (var nloops=0; nloops<10000; nloops++) {
                var buf1 = new Buffer(uuid());
                var buf2 = new Buffer(uuid());
                var sameCount = 0;
                for (var i=0; i<buf1.length; i++) {
                    var diff = buf1[i] ^ buf2[i];
                    if (!diff) sameCount += 1;
                }
                // minimum 5 identical bytes, and 1 that is the same 25% of the time
                // note: node-v0.10 through v5.8 often share 16-17 bytes in common
                // note: node-v6 through v10 generates much better random numbers,
                // node-v11 again occasionally shares 16 bytes (a lot less often)
                t.ok(sameCount <= 18);
            }
            t.done();
        },

        'should not have stuck bits': function(t) {
            // the shared-bytes test above also detects bytes that are always zero or do not change
            t.skip();
        },
    },
}
