var Utilities = require('../util/Utilities');
var Prefacer = require('../prefacer/Prefacer');
var UserService = require('../service/UserService');
var User = require('../model/User');
var Async = require('../util/Async');

function UserPrefacer(req, res) {
    Prefacer.call(this, req, res);
    
    this.uservice = new UserService();
}

Utilities.inherits(UserPrefacer, Prefacer);

module.exports = exports = UserPrefacer;

UserPrefacer.prototype.run = function(fn) {
    var async = new Async();
    var uservice = this.uservice;
    var check = function() {
    };
    //var user = null;
    async.push(uservice.mread, [2017], uservice, function(ret) {
        $logger.warn(ret);
        return Utilities.isEmpty(ret)?true:1;
    });
    async.push(uservice.mcreate, [new User({id:2017,name:'lay2017',pass:'',nick:'lay2017'})], uservice, function(ret) {
        return false;
    });
    /*async.push(uservice.mremove, [2017], uservice, function(ret) {
        $logger.warn(2222);
    });*/
    async.exec(function(read, create, remove) {
        $logger.error(read, create, remove);
    });
    //$logger.error(async);
    Utilities.isFunction(fn) && fn();
};
