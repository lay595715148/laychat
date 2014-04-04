var Redis = $.store.Redis;
var Pool = $.core.Pool;

/**
 * @abstract
 */
function RedisPool(name, redis) {
    Pool.call(this, name, redis);
}

$util.inherits(RedisPool, Pool);

module.exports = exports = RedisPool;
