var md5 = require('../util/MD5');
var User = require('../model/User');
var Store = require('../store/Store');
var Service = require('../service/Service');
var Prefacer = require('../prefacer/Prefacer');

function SessionService() {
    this.store = Store.factory('UserStore');
    this.memcache = Store.factory('UserMemcache');
}

$util.inherits(SessionService, Service);

module.exports = exports = SessionService;

SessionService.prototype.mread = function(sessionid, fn) {
    var key = 'session:' + sessionid;
    this.memcache.get(key, function(ret) {
        if($util.isString(ret)) {
            fn(new User($util.toJson(ret)));
        } else {
            fn(ret);
        }
    });
};
SessionService.prototype.mcreate = function(sessionid, user, lifetime, fn) {
    var key = 'session:' + sessionid;
    if($util.isFunction(lifetime)) {
        fn = lifetime;
        liftime = 1000;
    }
    this.memcache.set(key, $util.toString(user), function(ret) {
        fn(ret);
    }, liftime);
};
SessionService.prototype.mremove = function(sessionid, fn) {
    var key = 'session:' + sessionid;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
