if (/qnit/.test(process.argv[1])) return;

// npm install qtimeit uuid node-uuid hyperid mongoid-js fast-uuid

var qtimeit = require('qtimeit');
var uuidquick = require('./');

// require but guard against parse errors
function tryRequire(path) { try { return require(path) } catch (e) { return {} } }

var uuid = require('uuid').v4;
var nodeuuid = require('node-uuid').v4;
var fastuuid = tryRequire('fast-uuid').uuid4;
//var hyperidModule = require('hyperid');
//var hyperid = hyperidModule({ fixedLength: true });
//var shortid = require('shortid').generate;
//var nanoid = require('nanoid');
var mongoidjs = require('mongoid-js');

//var _140byte_uuid = function(){return(""+1e7+-1e3+-4e3+-8e3+-1e11).replace(/1|0/g,function(){return(0|Math.random()*16).toString(16)})};

var x, x2;

var mongoidFactory = new mongoidjs.MongoId();

qtimeit.bench.timeGoal = .2;
qtimeit.bench.showRunDetails = false;
qtimeit.bench.visualize = true;
qtimeit.bench.bargraphScale = 2;
qtimeit.bench.opsPerTest = 2;

var bench = {};
if (uuid) bench['uuid'] = function() { x = uuid(); x2 = uuid() };
if (nodeuuid) bench['node-uuid'] = function() { x = nodeuuid(); x2 = nodeuuid() };
if (fastuuid) bench['fast-uuid'] = function() { x = fastuuid(); x2 = fastuuid() };
if (uuidquick) bench['uuid-quick'] = function() { x = uuidquick(); x2 = uuidquick() };

// other ids
//'shortid': function() { x = shortid(); x2 = shortid() },     // very slow
//'nanoid': function() { x = nanoid(); x2 = nanoid() },
//'hyperid': function() { x = hyperid(); x2 = hyperid() },      // not a uuid, is fixed uuid+counter

qtimeit.bench(bench);

qtimeit.bench({
    'uuid-quick': function() { x = uuidquick(); x2 = uuidquick() },
    //'mongoid-js': function() { x = mongoidjs(); x2 = mongoidjs() },
    //'mongoid-js': function() { x = mongoidFactory.fetch(); x2 = mongoidFactory.fetch() },
    'mongoid-js short': function() { x = mongoidFactory.fetchShort(); x2 = mongoidFactory.fetchShort() },
});
