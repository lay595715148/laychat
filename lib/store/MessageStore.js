var Mongo = $.store.Mongo;
var Message = $.model.Message;

function MessageStore() {
    Mongo.call(this, Message, $config.get('servers.mongodb.master'));
}

$util.inherits(MessageStore, Mongo);

module.exports = exports = MessageStore;
