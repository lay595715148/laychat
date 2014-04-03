var lrucache = require('lru-cache');
var Pool = $.core.Pool;

/**
 * @abstract
 */
function EntityPool(name, entity) {
    var _entity = {};

    this.__defineSetter__('entity', function(entity) {
        if($util.isFunction(entity))
            _entity = entity;
        else if($util.isString(entity) && entity.indexOf('entity.') === 0)
            _entity = $require(entity);
        else if($util.isString(entity))
            _entity = $require('entity.' + entity);
    });
    this.__defineGetter__('entity', function() {
        return _entity;
    });
    
    this.entity = entity;
    
    Pool.call(this, name);
}

$util.inherits(EntityPool, Pool);

module.exports = exports = EntityPool;

EntityPool.prototype.open = function(config, fn) {
    if($util.isEmpty(this.storage)) {
        this.storage = new lrucache(config);
    }
    $util.isFunction(fn) && fn(true);
};
/**
 * @api protected
 * @returns
 */
EntityPool.prototype.key = function() {
    return this.entity.key();
};
/**
 * set an element in
 * @abstract
 */
EntityPool.prototype.set = function(obj, fn) {
    var id = this.key();
    var key, ret;
    if($util.isA(obj, this.entity)) {
        key = this.name + '.' + obj[id];
        ret = this.storage.set(key, obj);
    } else {
        ret = false;
    }
    $util.isFunction(fn) && fn(ret);
    return ret;
};
/**
 * set some elements in
 * @abstract
 */
EntityPool.prototype.sets = function(objs, fn) {
    var me = this, id = this.key(), key, ret;
    if($util.isAs(objs, this.entity)) {
        objs.map(function(obj) {
            key = me.name + '.' + obj[id];
            ret = me.storage.set(key, obj);
        });
    } else {
        ret = false;
    }
    $util.isFunction(fn) && fn(ret);
    return ret;
};
/**
 * get by key
 * @abstract
 */
EntityPool.prototype.get = function(pri, fn) {
    var key = this.name + '.' + pri;
    var ret = this.storage.get(key);
    $util.isFunction(fn) && fn(ret);
    return ret;
    
};
/**
 * get series by key array
 * @abstract
 */
EntityPool.prototype.gets = function(pris, fn) {
    var me = this, ret = [], key;
    if($util.isArray(pris)) {
        pris.map(function(pri) {
            key = me.name + '.' + pri;
            ret.push(me.storage.get(key));
        });
    }
    $util.isFunction(fn) && fn(ret);
    return ret;
};
/**
 * @abstract
 */
EntityPool.prototype.del = function(pri, fn) {
    var key = this.name + '.' + pri;
    var ret = this.storage.del(key);
    $util.isFunction(fn) && fn(ret);
    return ret;
};
/**
 * @abstract
 */
EntityPool.prototype.dels = function(pris) {
    var me = this, ret = [], key;
    if($util.isArray(pris)) {
        pris.map(function(pri) {
            key = me.name + '.' + pri;
            ret.push(me.storage.del(key));
        });
    }
    $util.isFunction(fn) && fn(ret);
    return ret;
};
/**
 * @abstract
 */
EntityPool.prototype.reset = function(fn) {
    this.storage.reset();
};
