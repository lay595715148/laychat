var Memcache = $.store.Memcache;
var ModelPool = $.pool.ModelPool;

/**
 * @abstract
 */
function MemcachePool(name, model, memcache) {
    var _lifetime = 0, _Memcache = {};

    this.__defineSetter__('memcache', function(memcache) {
        if($util.isA(memcache, Memcache))
            _memcache = memcache;
    });
    this.__defineGetter__('memcache', function(memcache) {
        return _memcache;
    });

    ModelPool.call(this, name, model);

    this.memcache = memcache;
}

$util.inherits(MemcachePool, ModelPool);

module.exports = exports = MemcachePool;

/**
 * @implement
 */
MemcachePool.prototype.load = function(fn) {
    var me = this;
    var name = this.name;
    this.memcache.gets(name, function(result) {
        var objects = result;
        objects.map(function(item) {
            me.push(item);
        });
        $util.isFunction(fn) && fn(objects);
    });
};
/**
 * @implement
 */
MemcachePool.prototype.save = function(lifetime, fn) {
    var name = this.name;
    var objects = this.objects;
    this.memcache.sets(name, objects, lifetime, function(result) {
        $util.isFunction(fn) && fn(result);
    });
};
