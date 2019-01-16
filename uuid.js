/**
 * uuid-quick -- much faster uuid() generator
 *
 * Copyright (C) 2019 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * 2019-01-15 - AR.
 */

'use strict';

module.exports = uuid;

function uuid() {
    return uuid_4();
};
uuid.uuid = uuid_4;
uuid.v4 = uuid_4;
uuid.rand = Math.random;
toStruct(uuid);


var hexchars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

// template from fast-uuid.js: "10000000-1000-4000-8000-100000000000";
var arr = new Array(36);
function uuid_4() {
    var rand = uuid.rand;

    var n1 = Math.floor(rand() * 0x1000000000);
    var n2 = Math.floor(rand() * 0x1000000000);
    var n3 = Math.floor(rand() * 0x1000000000);
    var n4 = Math.floor(rand() * 0x1000000000);

    copyin9c(arr, n1, 0);
    copyin9c(arr, n2, 9);
    copyin9c(arr, n3, 18);
    copyin9c(arr, n4, 27);

    arr[8] = '-';
    arr[13] = '-';
    arr[14] = '4';
    arr[18] = '-';
    arr[19] = hexchars[8 + (arr[19].charCodeAt(0) & 3)];
    arr[23] = '-';

    //return arr.join('');      // 1.15m/s v8, 1.2m/s v10
    return arrayConcat(arr);    // 1.9m/s v8, 2.1m/s v10
}

function arrayConcat(a) {
    var s = a[0], len = a.length;
    for (var i=1; i<len; i++) s += a[i];
    return s;
}

// Set 9 chars in buf starting at offset pos from the value n.
// N must be a float float between 0 and 1 with at least 36 bits of precision.
// note: node-v8 is very slow to copy into a Buffer, node-v10 is very fast
// Arrays are a good compromise, fast enough on all versions.
function copyin9c( buf, n, pos ) {
    for (var i=0; i<9; i++) {
        buf[pos+i] = hexchars[n & 0xF];
        n /= 16;
    }
    return;
}

function toStruct(obj) { return toStruct.prototype = obj }
