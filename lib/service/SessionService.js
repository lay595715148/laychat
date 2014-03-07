var md5 = require('../util/MD5');
var User = require('../model/User');
var Store = require('../store/Store');
var Service = require('../service/Service');

function SessionService() {
    //this.store = Store.factory('SessionStore');
    this.memcache = Store.factory('SessionMemcache');
    this.sign = $config.get('sign.memcache.session') || 'session';
}

$util.inherits(SessionService, Service);

module.exports = exports = SessionService;

SessionService.prototype.mread = function(sessionid, fn) {
    var key = this.sign + ':' + sessionid;
    this.memcache.get(key, function(ret) {
        if($util.isA(ret, User)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
SessionService.prototype.mcreate = function(sessionid, user, lifetime, fn) {
    var key = this.sign + ':' + sessionid;
    if($util.isFunction(lifetime)) {
        fn = lifetime;
        lifetime = 1800;
    }
    this.memcache.set(key, user, function(ret) {
        if(ret === 'STORED') {
            fn(ret);
        } else {
            fn(false);
        }
    }, lifetime);
};
SessionService.prototype.mremove = function(sessionid, fn) {
    var key = this.sign + ':' + sessionid;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
