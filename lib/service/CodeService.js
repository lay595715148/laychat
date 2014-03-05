var uuid = require('node-uuid');
var md5 = require('../util/MD5');
var OAuth2Code = require('../model/OAuth2Code');
var Store = require('../store/Store');
var Service = require('../service/Service');

function CodeService() {
    this.store = Store.factory('OAuth2CodeStore');
    this.memcache = Store.factory('OAuth2CodeMemcache');
    this.sign = $config.get('sign.memcache.oauth2.code') || 'code';
}

$util.inherits(CodeService, Service);

module.exports = exports = CodeService;

CodeService.prototype.checkCode = function(code, fn) {
    this.mread(code, fn);
};
/**
 * 
 * @param {OAuth2Code} code
 * @param fn
 */
CodeService.prototype.create = function(code, fn) {
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
CodeService.prototype.gen = function(clientId, userid, redirectURI, fn) {
    var code = md5(uuid.v4());
    var expires = ( $config.get('oauth2.code_lifetime') || 100 ) + $util.time();
    var c = new OAuth2Code();
    
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
CodeService.prototype.mread = function(code, fn) {
    var key = this.sign + ':' + code;
    this.memcache.get(key, function(ret) {
        if($util.isA(ret, OAuth2Code)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {OAuth2Code} code
 * @param fn
 */
CodeService.prototype.mcreate = function(code, fn) {
    var me = this;
    var key = this.sign + ':' + code.code;
    var lifetime = code.expires - $util.time();
    this.memcache.set(key, code, function(ret) {
        if(ret === 'STORED') {
            fn(ret);
            me.create(code, function(ret) {
                $logger.info('create code', ret, $util.toString(code));
            });
        } else {
            fn(false);
        }
    }, lifetime);
};
/**
 * 
 * @param {String} code
 * @param fn
 */
CodeService.prototype.mremove = function(code, fn) {
    var key = this.sign + ':' + code;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
