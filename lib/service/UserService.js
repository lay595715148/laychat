var md5 = $.util.MD5;
var User = $.model.User;
var Store = $.core.Store;
var StoreService = $.service.StoreService;

function UserService() {
    StoreService.call(this);
    this.store.mongo = Store.factory('store.mongo.UserMongo');
    this.store.memcache = Store.factory('store.memcache.UserMemcache');
    //this.redis = Store.factory('UserRedis');this.redis.init();
}

$util.inherits(UserService, StoreService);

module.exports = exports = UserService;

UserService.prototype.read = function(id, fn) {
    this.store.mongo.select({_id:id}, function(ret) {
        if(!$util.isError(ret) && $util.isArray(ret) && !$util.isEmpty(ret)) {
            fn(ret[0]);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param username
 * @param password md5前
 */
UserService.prototype.readByPassword = function(username, password, fn) {
    this.store.mongo.selectOne({name:username, pass:md5(password)}, function(ret) {
        if(!$util.isError(ret) && $util.isA(ret, User)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 */
UserService.prototype.readByIds = function(ids, fn) {
    this.store.mongo.select({_id: {$in: ids}}, function(ret) {
        if(!$util.isError(ret) && $util.isArray(ret)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
UserService.prototype.checkUser = function(username, password, fn) {
    this.readByPassword(username, password, fn);
};
UserService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(users) {
        if(!$util.isError(users) && $util.isArray(users)) {
            fn(users);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {User} user
 */
UserService.prototype.create = function(user, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    user = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(user, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
UserService.prototype.modify = function(id, params) {
    
};
UserService.prototype.mread = function(sessid, fn) {
    if($util.isString(sessid)) {
        var key = sessid;
        this.store.memcache.get(key, function(ret) {
            if($util.isA(ret, User)) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
UserService.prototype.mcreate = function(sessid, user, lifetime, fn) {
    if($util.isString(sessid) && $util.isA(user, User)) {
        var key = sessid;
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
    } else {
        fn(false);
    }
};
UserService.prototype.mremove = function(sessid, fn) {
    if($util.isString(sessid)) {
        var key = sessid;
        this.store.memcache.del(key, function(ret) {
            fn(ret);
        });
    } else {
        fn(false);
    }
};
