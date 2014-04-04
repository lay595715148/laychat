var Mongo = $.store.Mongo;
var Message = $.model.Message;

function MessageMongo() {
    Mongo.call(this, Message, $config.get('servers.mongodb.master'));
}

$util.inherits(MessageMongo, Mongo);

module.exports = exports = MessageMongo;
