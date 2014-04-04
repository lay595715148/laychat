var Mongo = $.store.Mongo;
var Client = $.model.Client;

function ClientMongo() {
    Mongo.call(this, Client, $config.get('servers.mongodb.master'));
}

$util.inherits(ClientMongo, Mongo);

module.exports = exports = ClientMongo;
