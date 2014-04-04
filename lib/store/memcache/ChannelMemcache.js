var MMemcache = $.store.MMemcache;
var Channel = $.model.Channel;

function ChannelMemcache() {
    MMemcache.call(this, Channel, $config.get('servers.memcache.master'));
}

$util.inherits(ChannelMemcache, MMemcache);

module.exports = exports = ChannelMemcache;
