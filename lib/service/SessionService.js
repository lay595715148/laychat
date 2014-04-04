var md5 = $.util.MD5;
var Session = $.model.Session;
var Store = $.store.Store;
var StoreService = $.service.StoreService;

function SessionService() {
    StoreService.call(this);
    //this.store.mongo = Store.factory('store.mongo.SessionStore');
    this.store.memcache = Store.factory('store.memcache.SessionMemcache');
}

$util.inherits(SessionService, StoreService);

module.exports = exports = SessionService;

SessionService.prototype.mread = function(sessionid, fn) {
    var key = sessionid;
    this.store.memcache.get(key, function(ret) {
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
    this.store.memcache.set(key, user, lifetime, function(ret) {
        if(ret === 'STORED') {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
SessionService.prototype.mremove = function(sessionid, fn) {
    var key = sessionid;
    this.store.memcache.del(key, function(ret) {
        fn(ret);
    });
};
