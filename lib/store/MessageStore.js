var Mongo = require('../store/Mongo');
var Message = require('../model/Message');

function MessageStore() {
    Mongo.call(this, Message, $config.get('servers.mongodb.master'));
}

$util.inherits(MessageStore, Mongo);

module.exports = exports = MessageStore;


