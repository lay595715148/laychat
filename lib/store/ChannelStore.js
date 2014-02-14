var Utilities = require('../util/Utilities');
var Mongo = require('../store/Mongo');
var Channel = require('../model/Channel');

function ChannelStore() {
    Mongo.call(this, new Channel(), $config.get('servers.mongodb.master'));
}

Utilities.inherits(ChannelStore, Mongo);

module.exports = exports = ChannelStore;
