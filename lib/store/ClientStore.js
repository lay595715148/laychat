var Mongo = $.store.Mongo;
var Client = $.model.Client;

function ClientStore() {
    Mongo.call(this, Client, $config.get('servers.mongodb.master'));
}

$util.inherits(ClientStore, Mongo);

module.exports = exports = ClientStore;
