var md5 = require('../util/MD5');
var User = require('../model/User');
var Store = require('../store/Store');
var Service = require('../service/Service');

function CodeService() {
    this.memcache = Store.factory('OAuth2CodeMemcache');
    this.sign = $config.get('sign.memcache.oauth2.code') || 'code';
}

$util.inherits(CodeService, Service);

module.exports = exports = CodeService;

CodeService.prototype.mread = function(token, fn) {
    var key = this.sign + ':' + token;
    this.memcache.get(key, function(ret) {
        if($util.isString(ret)) {
            fn(new User($util.toJson(ret)));
        } else {
            fn(false);
        }
    });
};
OAuth2TokenService.prototype.gen = function(clientId, redirectURI, userid, fn) {
    
};
CodeService.prototype.mcreate = function(token, user, lifetime, fn) {
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
CodeService.prototype.mremove = function(token, fn) {
    var key = this.sign + ':' + token;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
