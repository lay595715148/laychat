var Mongo = $.store.Mongo;
var Friend = $.model.Friend;

function FriendMongo() {
    Mongo.call(this, Friend, $config.get('servers.mongodb.master'));
}

$util.inherits(FriendMongo, Mongo);

module.exports = exports = FriendMongo;


