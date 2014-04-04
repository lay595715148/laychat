var md5 = $.util.MD5;
var Friend = $.model.Friend;
var User = $.model.User;
var Model = $.core.Model;
var Store = $.core.Store;
var StoreService = $.service.StoreService;

function FriendService() {
    StoreService.call(this);
    this.store.mongo = Store.factory('store.mongo.FriendMongo');
    this.store.memcache = Store.factory('store.memcache.FriendMemcache');
    //this.redis = Store.factory('redis.FriendRedis');this.redis.init();
}

$util.inherits(FriendService, StoreService);

module.exports = exports = FriendService;

FriendService.prototype.read = function(id, fn) {
    this.store.mongo.select({_id:id}, function(ret) {
        if(!$util.isError(ret) && $util.isArray(ret) && !$util.isEmpty(ret)) {
            fn(ret[0]);
        } else {
            fn(false);
        }
    });
};
FriendService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(friends) {
        if(!$util.isError(friends) && $util.isArray(friends)) {
            fn(friends);
        } else {
            fn(false);
        }
    });
};
FriendService.prototype.readByUser = function(userid, opts, fn) {
    var selector = {};
    var columns = Friend.columns();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    userid = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    selector[columns['user']] = userid;
    this.list(selector, opts, fn);
};
/**
 * 
 * @param {Friend} friend
 */
FriendService.prototype.create = function(friend, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    friend = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(friend, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
FriendService.prototype.mreadByUser = function(userid, fn) {
    if($util.isNumber(userid)) {
        var key = 'userid.' + userid;
        this.store.memcache.gets(key, function(ret) {
            if($util.isAs(ret, User)) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
FriendService.prototype.mcreateByUser = function(userid, friends, lifetime, fn) {
    if($util.isNumber(userid) && $util.isAs(friends, User)) {
        var key = 'userid.' + userid;
        if($util.isFunction(lifetime)) {
            fn = lifetime;
            lifetime = 1800;
        }
        this.store.memcache.sets(key, friends, lifetime, function(ret) {
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
FriendService.prototype.mremoveByUser = function(userid, fn) {
    if($util.isString(sessid)) {
        var key = 'userid.' + sessid;
        this.store.memcache.del(key, function(ret) {
            fn(ret);
        });
    } else {
        fn(false);
    }
};
