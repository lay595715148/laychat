var MRedis = $.store.MRedis;
var ModelPool = $.pool.ModelPool;

/**
 * @abstract
 */
function MRedisPool(name, mredis) {
    ModelPool.call(this, name, mredis, redis.model);
}

$util.inherits(MRedisPool, ModelPool);

module.exports = exports = MRedisPool;
