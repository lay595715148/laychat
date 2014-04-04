var MMemcache = $.store.MMemcache;
var Message = $.model.Message;

function MessageMemcache() {
    MMemcache.call(this, Message, $config.get('servers.memcache.master'));
}

$util.inherits(MessageMemcache, MMemcache);

module.exports = exports = MessageMemcache;
