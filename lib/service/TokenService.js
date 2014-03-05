var uuid = require('node-uuid');
var md5 = require('../util/MD5');
var Async = require('../util/Async');
var OAuth2Token = require('../model/OAuth2Token');
var Store = require('../store/Store');
var Service = require('../service/Service');

function TokenService() {
    this.store = Store.factory('OAuth2TokenStore');
    this.memcache = Store.factory('OAuth2TokenMemcache');
    this.sign = $config.get('sign.memcache.oauth2.token') || 'token';
}

$util.inherits(TokenService, Service);

module.exports = exports = TokenService;

/**
 * 
 * @param {String} token
 * @param fn
 */
TokenService.prototype.checkToken = function(token, fn) {
    this.mread(token, fn);
};
/**
 * 
 * @param {OAuth2Token} token
 * @param fn
 */
TokenService.prototype.create = function(token, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    token = args.length ? args.shift() || {} : {};
    
    this.store.insert(token, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
TokenService.prototype.gen = function(clientId, userid, use_refresh_token, fn) {
    var token = md5(uuid.v4());
    var rtoken = md5(uuid.v4());
    var expires = ($config.get('oauth2.access_token_lifetime') || 1800) + $util.time();
    var rexpires = ($config.get('oauth2.refresh_token_lifetime') || 86400) + $util.time();
    var t = new OAuth2Token();
    var rt = new OAuth2Token();
    var async = new Async();
    
    t.setToken(token);
    t.setExpires(expires);
    t.setClientId(clientId);
    t.setUserid(userid);
    t.setType(1);
    rt.setToken(rtoken);
    rt.setExpires(rexpires);
    rt.setClientId(clientId);
    rt.setUserid(userid);
    rt.setType(2);
    
    async.push(this.mcreate, [t], this, function(ret) {
        if(!use_refresh_token || !ret) {
            if(ret) {
                fn(t);
            } else {
                fn(false);
            }
            return false;//下一个任务不执行
        }
    });
    async.push(this.mcreate, [rt], this, function(ret) {
        if(ret) {
            fn([t, rt]);
        } else {
            fn(false);
        }
    });
    async.exec();
};
/**
 * 
 * @param {String} token
 * @param fn
 */
TokenService.prototype.mread = function(token, fn) {
    var key = this.sign + ':' + token;
    this.memcache.get(key, function(ret) {
        if($util.isA(ret, OAuth2Token)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {OAuth2Token} token
 * @param fn
 */
TokenService.prototype.mcreate = function(token, fn) {
    var me = this;
    var key = this.sign + ':' + token.token;
    var lifetime = token.expires - $util.time();
    this.memcache.set(key, token, function(ret) {
        if(ret === 'STORED') {
            fn(ret);
            me.create(token, function(ret) {
                $logger.info('create token', ret, $util.toString(token));
            });
        } else {
            fn(false);
        }
    }, lifetime);
};
/**
 * 
 * @param {String} token
 * @param fn
 */
TokenService.prototype.mremove = function(token, fn) {
    var key = this.sign + ':' + token;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
