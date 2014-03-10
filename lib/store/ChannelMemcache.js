var Memcache = require('../store/Memcache');
var Channel = require('../model/Channel');

function ChannelMemcache() {
    Memcache.call(this, Channel, $config.get('servers.memcache.master'));
}

$util.inherits(ChannelMemcache, Memcache);

module.exports = exports = ChannelMemcache;


