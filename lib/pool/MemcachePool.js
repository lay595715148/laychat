var Memcache = $.store.Memcache;
var ModelPool = $.pool.ModelPool;

/**
 * @abstract
 */
function MemcachePool(name, memcache) {
    ModelPool.call(this, name, memcache, memcache.model);
}

$util.inherits(MemcachePool, ModelPool);

module.exports = exports = MemcachePool;


MemcachePool.prototype.open = function(config, fn) {
    $util.isFunction(fn) && fn(true);
};
/**
 * set an element in
 * @abstract
 */
MemcachePool.prototype.set = function(obj, fn) {
    var id = this.key();
    var key;
    if($util.isA(obj, this.entity)) {
        key = this.name + '.' + obj[id];
        this.storage.set(key, obj, fn);
    } else {
        $util.isFunction(fn) && fn(false);
    }
};
/**
 * set some elements in
 * @abstract
 */
MemcachePool.prototype.sets = function(objs, fn) {
    var me = this, id = this.key(), keys = [];
    if($util.isAs(objs, this.entity)) {
        objs.map(function(obj) {
            keys.push(me.name + '.' + obj[id]);
        });
        me.storage.sets(keys, objs, 0, fn);
    } else {
        $util.isFunction(fn) && fn(false);
    }
};
/**
 * get by key
 * @abstract
 */
MemcachePool.prototype.get = function(pri, fn) {
    this.storage.get(this.name + '.' + pri, fn);
};
/**
 * get series by key array
 * @abstract
 */
MemcachePool.prototype.gets = function(pris, fn) {
    var me = this, keys = [];
    if($util.isArray(pris)) {
        pris.map(function(pri) {
            keys.push(me.name + '.' + pri);
        });
        this.storage.gets(keys, fn);
    } else {
        $util.isFunction(fn) && fn(false);
    }
};
/**
 * @abstract
 */
MemcachePool.prototype.del = function(pri, fn) {
    this.storage.del(this.name + '.' + pri, fn);
};
/**
 * @abstract
 */
MemcachePool.prototype.dels = function(pris) {
    var me = this, id = this.key(), keys = [];
    if($util.isAs(objs, this.entity)) {
        objs.map(function(obj) {
            keys.push(me.name + '.' + obj[id]);
        });
        this.storage.sets(keys, fn);
    } else {
        $util.isFunction(fn) && fn(false);
    }
};
/**
 * @abstract
 */
MemcachePool.prototype.reset = function(fn) {
    this.storage.reset();
};
