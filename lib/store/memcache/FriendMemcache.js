var Memcache = $require('store.Memcache');
var Friend = $require('model.Friend');

function FriendMemcache() {
    Memcache.call(this, Friend, $config.get('servers.memcache.master'));
}

$util.inherits(FriendMemcache, Memcache);

module.exports = exports = FriendMemcache;
