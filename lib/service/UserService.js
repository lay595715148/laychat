var Utilities = require('../util/Utilities');
var md5 = require('../util/MD5');
var User = require('../model/User');
var UserStore = require('../store/UserStore');
var UserMemcache = require('../store/UserMemcache');
var Service = require('../service/Service');
var Prefacer = require('../prefacer/Prefacer');

function UserService() {
    this.store = new UserStore();
    this.memcache = new UserMemcache();
}

Utilities.inherits(UserService, Service);

module.exports = exports = UserService;

UserService.prototype.read = function(id, fn) {
    this.store.select({id:id}, function(ret) {
        if(!Utilities.isError(ret) && Utilities.isArray(ret)) {
            fn(new User(ret[0]));
        } else {
            fn(ret);
        }
    });
};
/**
 * 
 * @param username
 * @param password md5前
 */
UserService.prototype.readByPassword = function(username, password) {
    this.store.select({name:username, pass:md5(password)}, function(ret) {
        if(!Utilities.isError(ret) && Utilities.isArray(ret)) {
            fn(new User(ret[0]));
        } else {
            fn(ret);
        }
    });
};
UserService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.select({}, function(users) {
        if(!Utilities.isError(users) && Utilities.isArray(users)) {
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
    fn(true);
};
UserService.prototype.modify = function(id, params) {
    
};
UserService.prototype.mread = function(id, fn) {
    var key = 'user:' + id;
    this.memcache.get(key, function(ret) {
        if(Utilities.isString(ret)) {
            fn(new User(Utilities.toJson(ret)));
        } else {
            fn(ret);
        }
    });
};
UserService.prototype.mcreate = function(user, lifetime, fn) {
    var key = 'user:' + user.id;
    if(Utilities.isFunction(lifetime)) {
        fn = lifetime;
        liftime = 1000;
    }
    this.memcache.set(key, Utilities.toString(user), function(ret) {
        fn(ret);
    }, liftime);
};
UserService.prototype.mremove = function(id, fn) {
    var key = 'user:' + id;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
