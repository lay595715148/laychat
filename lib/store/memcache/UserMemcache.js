var MMemcache = $.store.MMemcache;
var User = $.model.User;

function UserMemcache() {
    MMemcache.call(this, User, $config.get('servers.memcache.master'));
}

$util.inherits(UserMemcache, MMemcache);

module.exports = exports = UserMemcache;
