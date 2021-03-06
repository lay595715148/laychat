var uuid = require('node-uuid');
var md5 = $.util.MD5;
var Async = $.util.Async;
var Model = $.core.Model;
var OAuth2Token = $.model.OAuth2Token;
var Store = $.core.Store;
var StoreService = $.service.StoreService;

function OAuth2TokenService() {
    StoreService.call(this);
    this.store.mongo = Store.factory('store.mongo.OAuth2TokenMongo');
    this.store.memcache = Store.factory('store.memcache.OAuth2TokenMemcache');
}

$util.inherits(OAuth2TokenService, StoreService);

module.exports = exports = OAuth2TokenService;

/**
 * 
 * @param selector
 * @param opts
 * @param fn
 */
OAuth2TokenService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(tokens) {
        if(!$util.isError(tokens) && $util.isArray(tokens)) {
            fn(tokens);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {String} token
 * @param fn
 */
OAuth2TokenService.prototype.checkToken = function(token, fn) {
    this.mread(token, fn);
};
/**
 * 
 * @param {OAuth2Token} token
 * @param fn
 */
OAuth2TokenService.prototype.create = function(token, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    token = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(token, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
OAuth2TokenService.prototype.gen = function(clientId, userid, use_refresh_token, fn) {
    var token = md5(uuid.v4());
    var rtoken = md5(uuid.v4());
    var expires = ($config.get('oauth2.access_token_lifetime') || 1800) + $util.time();
    var rexpires = ($config.get('oauth2.refresh_token_lifetime') || 86400) + $util.time();
    var t = Model.instance('OAuth2Token');
    var rt = Model.instance('OAuth2Token');
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
OAuth2TokenService.prototype.mread = function(token, fn) {
    if($util.isString(token)) {
        var key = token;
        this.store.memcache.get(key, function(ret) {
            if($util.isA(ret, OAuth2Token)) {
                fn(ret);
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
/**
 * 
 * @param {OAuth2Token} token
 * @param fn
 */
OAuth2TokenService.prototype.mcreate = function(token, fn) {
    if($util.isA(token, OAuth2Token)) {
        var me = this;
        var key = token.token;
        var lifetime = token.expires - $util.time();
        this.store.memcache.set(key, token, lifetime, function(ret) {
            if(ret === 'STORED') {
                fn(ret);
                me.create(token, function(ret) {
                    $logger.info('create token', ret, $util.toString(token));
                });
            } else {
                fn(false);
            }
        });
    } else {
        fn(false);
    }
};
/**
 * 
 * @param {String} token
 * @param fn
 */
OAuth2TokenService.prototype.mremove = function(token, fn) {
    if($util.isString(token)) {
        var key = token;
        this.store.memcache.del(key, function(ret) {
            fn(ret);
        });
    } else {
        fn(false);
    }
};
