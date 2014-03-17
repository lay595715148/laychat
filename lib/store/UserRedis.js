var Redis = require('../store/Redis');
var User = require('../model/User');

function UserRedis() {
    Redis.call(this, User, $config.get('servers.redis.master'));
}

$util.inherits(UserRedis, Redis);

module.exports = exports = UserRedis;
