var Redis = $.store.Redis;
var User = $.model.User;

function UserRedis() {
    Redis.call(this, User, $config.get('servers.redis.master'));
}

$util.inherits(UserRedis, Redis);

module.exports = exports = UserRedis;
