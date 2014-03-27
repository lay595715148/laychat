var Memcache = $.store.Memcache;
var Message = $.model.Message;

function MessageMemcache() {
    Memcache.call(this, Message, $config.get('servers.memcache.master'));
}

$util.inherits(MessageMemcache, Memcache);

module.exports = exports = MessageMemcache;
