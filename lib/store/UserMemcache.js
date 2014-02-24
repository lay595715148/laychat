var Memcache = require('../store/Memcache');
var User = require('../model/User');

function UserMemcache() {
    Memcache.call(this, User, $config.get('servers.memcache.master'));
}

$util.inherits(UserMemcache, Memcache);

module.exports = exports = UserMemcache;
