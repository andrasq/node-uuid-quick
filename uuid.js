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
for (var i=0; i<16; i++) hexchars[i * 16] = hexchars[i];        // map high nybble too

// template from fast-uuid.js: "10000000-1000-4000-8000-100000000000";
var arr = new Array(36);
function uuid_4() {
    var rand = uuid.rand;

    setChars(arr, rand(), 0);
    setChars(arr, rand(), 9);
    setChars(arr, rand(), 18);
    setChars(arr, rand(), 27);

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
function setChars( buf, n, pos ) {
    for (var i=0; i<8; i+=2) {
        n *= 0x100;
        buf[pos+i+0] = hexchars[n & 0xF0];
        buf[pos+i+1] = hexchars[n & 0x0F];
        n -= Math.floor(n);
    }
    buf[pos+8] = hexchars[(n * 16) & 0xF];
    return;
}

function toStruct(obj) { return toStruct.prototype = obj }
