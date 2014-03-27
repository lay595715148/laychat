var Memcache = $.store.Memcache;
var User = $.model.User;

function UserMemcache() {
    Memcache.call(this, User, $config.get('servers.memcache.master'));
}

$util.inherits(UserMemcache, Memcache);

module.exports = exports = UserMemcache;
