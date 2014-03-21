var md5 = require('../util/MD5');
var Session = require('../model/Session');
var Store = require('../store/Store');
var Service = require('../service/Service');

function SessionService() {
    //this.store = Store.factory('SessionStore');
    this.memcache = Store.factory('SessionMemcache');
}

$util.inherits(SessionService, Service);

module.exports = exports = SessionService;

SessionService.prototype.mread = function(sessionid, fn) {
    var key = sessionid;
    this.memcache.get(key, function(ret) {
        if($util.isA(ret, Session)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
SessionService.prototype.mcreate = function(sessionid, user, lifetime, fn) {
    var key = sessionid;
    if($util.isFunction(lifetime)) {
        fn = lifetime;
        lifetime = 1800;
    }
    this.memcache.set(key, user, lifetime, function(ret) {
        if(ret === 'STORED') {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
SessionService.prototype.mremove = function(sessionid, fn) {
    var key = sessionid;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
