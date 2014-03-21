var Memcache = $require('store.Memcache');
var User = $require('model.User');

function FriendMemcache() {
    Memcache.call(this, User, $config.get('servers.memcache.master'));
}

$util.inherits(FriendMemcache, Memcache);

module.exports = exports = FriendMemcache;
