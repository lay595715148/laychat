var MMemcache = $.store.MMemcache;
var User = $.model.User;

function FriendMemcache() {
    MMemcache.call(this, User, $config.get('servers.memcache.master'));
}

$util.inherits(FriendMemcache, MMemcache);

module.exports = exports = FriendMemcache;
