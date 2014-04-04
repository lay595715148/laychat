var MMemcache = $.store.MMemcache;
var Client = $.model.Client;

function ClientMemcache() {
    MMemcache.call(this, Client, $config.get('servers.memcache.master'));
}

$util.inherits(ClientMemcache, MMemcache);

module.exports = exports = ClientMemcache;
