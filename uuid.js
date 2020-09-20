/**
 * uuid-quick -- much faster uuid() generator
 *
 * Copyright (C) 2019-2020 Andras Radics
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
// node-v0.8, 0.10, 5.8 have poor random number generators, sharing 20-30 bits between results
uuid.rand = Math.random;
toStruct(uuid);

var CH_1 = 0x31;
var CH_4 = 0x34;
var CH_8 = 0x38;
var CH_DASH = 0x2D;

// fromCharCode is with many args is faster but only since node-v0.11; spread args faster since node-v8
// In newer node versions fromCharCode.apply is also fast, but spread args are faster.
// fromCharCode.apply is only fast since node-v8, spread args are faster but were 30x slower before v8
// Node before v0.11 is slow with multi-arg fromCharCode and is faster with a convert-char-at-a-time loop.
function tryEval(s) { try { return eval(s) } catch (e) {} }
var fromCharCodeLoop = eval("true && function(a) { var s = ''; for (var i=0; i<a.length; i++) s += String.fromCharCode(a[i]); return s }");
var fromCharCodeSpread = tryEval("true && function(a) { return String.fromCharCode(...a) }");
var fromCharCode = eval("parseInt(process.versions.node) >= 9 ? fromCharCodeSpread : fromCharCodeLoop");


// uuid template: "10000000-1000-4000-8000-100000000000"
//   where 1,0 = [0-9a-f], 4 = 4-bit version 0b0100 [4], 8: 0b10xx [89ab]
var hexmap = [0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66];
var arr = new Array(36);
function uuid_4() {
    var rand = uuid.rand;

    setChars12(arr, rand(), 0);
    setChars12(arr, rand(), 12);
    setChars12(arr, rand(), 24);

    arr[8]  = CH_DASH;
    arr[13] = CH_DASH;
    arr[14] = CH_4;
    arr[18] = CH_DASH
    arr[19] = CH_8 + (arr[19] & 3);
    arr[23] = CH_DASH;

    return fromCharCode(arr);
}

// extract 12 4-bit values into buf from the value n, to offets [pos..pos+11]
// n must be a random float between 0 and 1 with at least 48 bits of precision.
function setChars12( buf, n, pos ) {
    for (var i=0; i<12; i+=3) {
        n *= 0x1000;
        buf[pos + i + 0] = hexmap[(n      ) & 0xF];
        buf[pos + i + 1] = hexmap[(n >>> 4) & 0xF];
        buf[pos + i + 2] = hexmap[(n >>> 8) & 0xF];
    }
    return;
}

function toStruct(obj) { return toStruct.prototype = obj }
