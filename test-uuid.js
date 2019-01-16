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

        'should not have stuck bits': function(t) {
            t.skip();
        },
    },
}
