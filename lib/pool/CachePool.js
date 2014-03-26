var nodecache = require('node-cache');
var assert = require('assert');
var ModelPool = $require('pool.ModelPool');

/**
 * @abstract
 */
function CachePool(name, entity, lifetime) {
    var _lifetime = 0, _nodecache = new nodecache({ stdTTL : 0, checkperiod : 120 });

    this.__defineSetter__('lifetime', function(lifetime) {
        if($util.isInteger(lifetime))
            _lifetime = lifetime;
    });
    this.__defineGetter__('lifetime', function() {
        return _lifetime;
    });
    this.__defineGetter__('cache', function() {
        return _nodecache;
    });

    this.lifetime = lifetime;

    ModelPool.call(this, name, entity);
}

$util.inherits(CachePool, ModelPool);

module.exports = exports = CachePool;

/**
 * @implement
 */
CachePool.prototype.load = function(fn) {
    var me = this;
    var name = this.name;
    this.cache.get(name, function(err, result) {
        assert.equal(null, err);
        var objects = result[name];
        if($util.isArray(objects)) {
            me.objects = [];
            objects.map(function(item) {
                me.push(item);
            });
        }
        $util.isFunction(fn) && fn(objects);
    });
    return this;
};
/**
 * @implement
 */
CachePool.prototype.save = function(fn) {
    var name = this.name;
    var objects = this.objects;
    var lifetime = this.lifetime;
    this.cache.set(name, objects, lifetime, function(err, result) {
        assert.equal(null, err);
        $util.isFunction(fn) && fn(result);
    });
    return this;
};
