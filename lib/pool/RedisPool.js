var Redis = $.store.Redis;
var ModelPool = $.pool.ModelPool;

/**
 * @abstract
 */
function RedisPool(name, model, redis) {
    var _redis = {};

    this.__defineSetter__('redis', function(redis) {
        if($util.isA(redis, Redis))
            _redis = redis;
    });
    this.__defineGetter__('redis', function(redis) {
        return _redis;
    });

    this.redis = redis;

    ModelPool.call(this, name, model);
}

$util.inherits(RedisPool, ModelPool);

module.exports = exports = RedisPool;
