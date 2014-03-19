var md5 = require('../util/MD5');
var Friend = require('../model/Friend');
var Store = require('../store/Store');
var Service = require('../service/Service');

function FriendService() {
    this.store = Store.factory('mongo.FriendMongo');
    this.memcache = Store.factory('memcache.FriendMemcache');
    //this.redis = Store.factory('redis.FriendRedis');this.redis.init();
}

$util.inherits(FriendService, Service);

module.exports = exports = FriendService;

FriendService.prototype.read = function(id, fn) {
    this.store.select({_id:id}, function(ret) {
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
    this.store.select(selector, function(friends) {
        if(!$util.isError(friends) && $util.isArray(friends)) {
            fn(friends);
        } else {
            fn(false);
        }
    });
};
FriendService.prototype.readByUser = function(userid, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    userid = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.list({"userid":userid}, opts, fn);
};
/**
 * 
 * @param {Friend} friend
 */
FriendService.prototype.create = function(friend, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    friend = args.length ? args.shift() || {} : {};
    
    this.store.insert(friend, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
