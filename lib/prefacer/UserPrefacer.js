var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function UserPrefacer(req, res) {
    Prefacer.call(this, req, res);
    
    this.uservice = Service.factory('UserService');
}

$util.inherits(UserPrefacer, Prefacer);

module.exports = exports = UserPrefacer;

UserPrefacer.prototype.run = function(fn) {
    var scope = new Scope(this.request);
    $logger.info(scope.param());
    var async = new Async();
    var uservice = this.uservice;
    async.push(uservice.mread, [2017], uservice, function(ret) {
        $logger.warn($util.json(ret));
        return $util.isEmpty(ret)?true:1;
    });
    async.push(uservice.mcreate, [new User({id:2017,name:'lay2017',pass:'',nick:'lay2017'})], uservice, function(ret) {
        return false;
    });
    /*async.push(uservice.mremove, [2017], uservice, function(ret) {
        $logger.warn(2222);
    });*/
    async.exec(function(read, create, remove) {
        $logger.error($util.json(read), $util.json(create), $util.json(remove));
    });
    //$logger.error(async);
    $util.isFunction(fn) && fn();
};
