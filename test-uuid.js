'use strict';

var uuid = require('./');

// from qibl-1.3.0
var nodeMajor = parseInt(process.versions.node);
var newBuffer = eval('nodeMajor < 10 ? Buffer : function(a, b, c) { return typeof(a) === "number" ? Buffer.allocUnsafe(a) : Buffer.from(a, b, c) }');

module.exports = {
    'package': {
        'should export expected properties': function(t) {
            t.equal(typeof uuid, 'function');
            t.equal(typeof uuid.uuid, 'function');
            t.equal(typeof uuid.v4, 'function');
            t.equal(uuid.v4, uuid.uuid);
            t.ok(uuid.rand() != uuid.rand());
            t.done();
        },
    },

    'uuid_4': {
        'should generate a 36-byte string of the right format': function(t) {
            var format = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/;
            for (var i=0; i<100000; i++) {
                var id = uuid();
                t.equal(typeof id, 'string');
                t.equal(id.length, 36);
                t.ok(format.test(id), id);
            }
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
            var maxSameCount = 0;
            for (var nloops=0; nloops<10000; nloops++) {
                var buf1 = newBuffer(uuid());
                var buf2 = newBuffer(uuid());
                var sameCount = 0;
                for (var i=0; i<buf1.length; i++) {
                    var diff = buf1[i] ^ buf2[i];
                    if (!diff) sameCount += 1;
                }
                if (sameCount > maxSameCount) maxSameCount = sameCount;
                // minimum 5 identical bytes, and 1 that is the same 25% of the time
                // note: node-v0.10 through v5 often share 16-17 bytes in common (more on Ryzen), and v11 too
                t.ok(sameCount <= 16, "too many identical bytes: " + sameCount);
            }
            console.log("AR: most identical bytes out of 10k pairs of ids", maxSameCount);
            t.done();
        },

        'should not have stuck bits': function(t) {
            // the shared-bytes test above also detects bytes that are always zero or do not change
            var ones =  'ffffffff-ffff-ffff-ffff-ffffffffffff'.split('').map(hexval);
            var zeros = '00000000-0000-0000-0000-000000000000'.split('').map(hexval);
            for (var nloops=0; nloops<1000; nloops++) {
                var id = uuid();
                for (var i=0; i<id.length; i++) ones[i] &= hexval(id[i]);       // gather zero bits
                for (var i=0; i<zeros.length; i++) zeros[i] |= hexval(id[i]);   // gather one bits
            }

            // all variable bits should have seen a 1
            t.deepEqual(zeros, [15,15,15,15,15,15,15,15, 0, 15,15,15,15, 0, 4,15,15,15, 0, 11,15,15,15, 0, 15,15,15,15,15,15,15,15,15,15,15,15]);

            // all variable bits should have seen a 0
            t.deepEqual(ones, [0,0,0,0,0,0,0,0,          0, 0,0,0,0,     0, 4,0,0,0,    0, 8,0,0,0,     0, 0,0,0,0,0,0,0,0,0,0,0,0]);

            t.done();
            function hexval(ch) { return ch === '-' ? 0 : ch >= 'a' ? (ch.charCodeAt(0) - 0x61 + 10) : (ch.charCodeAt(0) - 0x30) }
        },
    },
}
