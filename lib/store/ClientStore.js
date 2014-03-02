var Mongo = require('../store/Mongo');
var Client = require('../model/Client');

function ClientStore() {
    Mongo.call(this, Client, $config.get('servers.mongodb.master'));
}

$util.inherits(ClientStore, Mongo);

module.exports = exports = ClientStore;


