var Memcache = $.store.Memcache;
var Channel = $.model.Channel;

function ChannelMemcache() {
    Memcache.call(this, Channel, $config.get('servers.memcache.master'));
}

$util.inherits(ChannelMemcache, Memcache);

module.exports = exports = ChannelMemcache;
