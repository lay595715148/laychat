var Memcache = $.store.Memcache;
var Client = $.model.Client;

function ClientMemcache() {
    Memcache.call(this, Client, $config.get('servers.memcache.master'));
}

$util.inherits(ClientMemcache, Memcache);

module.exports = exports = ClientMemcache;
