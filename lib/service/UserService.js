var md5 = require('../util/MD5');
var User = require('../model/User');
var Store = require('../store/Store');
var Service = require('../service/Service');

function UserService() {
    this.store = Store.factory('UserStore');
    this.memcache = Store.factory('UserMemcache');
    this.sign = $config.get('sign.memcache.user', 'user');
}

$util.inherits(UserService, Service);

module.exports = exports = UserService;

UserService.prototype.read = function(id, fn) {
    this.store.select({_id:id}, function(ret) {
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
    this.store.selectOne({name:username, pass:md5(password)}, function(ret) {
        if(!$util.isError(ret) && $util.isA(ret, User)) {
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
    this.store.select(selector, function(users) {
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
    
    this.store.insert(user, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
UserService.prototype.modify = function(id, params) {
    
};
UserService.prototype.mread = function(sessionid, fn) {
    var key = this.sign + ':' + sessionid;
    this.memcache.get(key, function(ret) {
        if($util.isA(ret, User)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
UserService.prototype.mcreate = function(sessionid, user, lifetime, fn) {
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
UserService.prototype.mremove = function(sessionid, fn) {
    var key = this.sign + ':' + sessionid;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
