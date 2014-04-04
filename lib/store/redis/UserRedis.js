var MRedis = $.store.MRedis;
var User = $.model.User;

function UserRedis() {
    MRedis.call(this, User, $config.get('servers.redis.master'));
}

$util.inherits(UserRedis, MRedis);

module.exports = exports = UserRedis;
