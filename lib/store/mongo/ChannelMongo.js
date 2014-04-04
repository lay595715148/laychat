var Mongo = $.store.Mongo;
var Channel = $.model.Channel;

function ChannelMongo() {
    Mongo.call(this, Channel, $config.get('servers.mongodb.master'));
}

$util.inherits(ChannelMongo, Mongo);

module.exports = exports = ChannelMongo;
