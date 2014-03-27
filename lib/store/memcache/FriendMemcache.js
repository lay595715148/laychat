var Memcache = $.store.Memcache;
var User = $.model.User;

function FriendMemcache() {
    Memcache.call(this, User, $config.get('servers.memcache.master'));
}

$util.inherits(FriendMemcache, Memcache);

module.exports = exports = FriendMemcache;
