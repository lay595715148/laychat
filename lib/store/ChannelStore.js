var Mongo = require('../store/Mongo');
var Channel = require('../model/Channel');

function ChannelStore() {
    Mongo.call(this, Channel, $config.get('servers.mongodb.master'));
}

$util.inherits(ChannelStore, Mongo);

module.exports = exports = ChannelStore;
