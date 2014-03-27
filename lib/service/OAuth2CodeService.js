var uuid = require('node-uuid');
var md5 = $.util.MD5;
var Model = $.core.Model;
var OAuth2Code = $.model.OAuth2Code;
var Store = $.core.Store;
var Service = $.core.Service;

function OAuth2CodeService() {
    this.store = Store.factory('OAuth2CodeStore');
    this.memcache = Store.factory('OAuth2CodeMemcache');
}

$util.inherits(OAuth2CodeService, Service);

module.exports = exports = OAuth2CodeService;

/**
 * 
 * @param selector
 * @param opts
 * @param fn
 */
OAuth2CodeService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.select(selector, function(codes) {
        if(!$util.isError(codes) && $util.isArray(codes)) {
            fn(codes);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param code
 * @param fn
 */
OAuth2CodeService.prototype.checkCode = function(code, fn) {
    this.mread(code, fn);
};
/**
 * 
 * @param {OAuth2Code} code
 * @param fn
 */
OAuth2CodeService.prototype.create = function(code, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    code = args.length ? args.shift() || {} : {};
    
    this.store.insert(code, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
OAuth2CodeService.prototype.gen = function(clientId, userid, redirectURI, fn) {
    var code = md5(uuid.v4());
    var expires = ( $config.get('oauth2.code_lifetime') || 100 ) + $util.time();
    var c = Model.instance('OAuth2Code');
    
    c.setCode(code);
    c.setExpires(expires);
    c.setClientId(clientId);
    c.setUserid(userid);
    c.setRedirectURI(redirectURI);
    
    this.mcreate(c, function(ret) {
        if(ret) {
            fn(c);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {String} code
 * @param fn
 */
OAuth2CodeService.prototype.mread = function(code, fn) {
    if($util.isString(code)) {
        var key = code;
        this.memcache.get(key, function(ret) {
            if($util.isA(ret, OAuth2Code)) {
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
 * @param {OAuth2Code} code
 * @param fn
 */
OAuth2CodeService.prototype.mcreate = function(code, fn) {
    if($util.isA(code, OAuth2Code)) {
        var me = this;
        var key = code.code;
        var lifetime = code.expires - $util.time();
        this.memcache.set(key, code, lifetime, function(ret) {
            if(ret === 'STORED') {
                fn(ret);
                me.create(code, function(ret) {
                    $logger.info('create code', ret, $util.toString(code));
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
 * @param {String} code
 * @param fn
 */
OAuth2CodeService.prototype.mremove = function(code, fn) {
    if($util.isString(code)) {
        var key = code;
        this.memcache.del(key, function(ret) {
            fn(ret);
        });
    } else {
        fn(false);
    }
};
