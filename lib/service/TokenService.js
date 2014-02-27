var md5 = require('../util/MD5');
var User = require('../model/User');
var Store = require('../store/Store');
var Service = require('../service/Service');
var Prefacer = require('../prefacer/Prefacer');

function TokenService() {
    this.store = Store.factory('UserStore');
    this.memcache = Store.factory('UserMemcache');
    this.sign = $config.get('sign.memcache.token') || 'token';
}

$util.inherits(TokenService, Service);

module.exports = exports = TokenService;

TokenService.prototype.mread = function(token, fn) {
    var key = this.sign + ':' + token;
    this.memcache.get(key, function(ret) {
        if($util.isString(ret)) {
            fn(new User($util.toJson(ret)));
        } else {
            fn(false);
        }
    });
};
TokenService.prototype.mcreate = function(token, user, lifetime, fn) {
    var key = this.sign + ':' + token;
    if($util.isFunction(lifetime)) {
        fn = lifetime;
        liftime = 1800;
    }
    this.memcache.set(key, $util.toString(user), function(ret) {
        if(ret === 'STORED') {
            fn(ret);
        } else {
            fn(false);
        }
    }, liftime);
};
TokenService.prototype.mremove = function(token, fn) {
    var key = this.sign + ':' + token;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
