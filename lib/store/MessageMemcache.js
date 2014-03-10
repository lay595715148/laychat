var Mongo = require('../store/Mongo');
var Message = require('../model/Message');

function MessageMemcache() {
    Mongo.call(this, Message, $config.get('servers.memcache.master'));
}

$util.inherits(MessageMemcache, Mongo);

module.exports = exports = MessageMemcache;
