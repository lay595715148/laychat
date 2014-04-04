var Mongo = $.store.Mongo;
var User = $.model.User;

function UserMongo() {
    Mongo.call(this, User, $config.get('servers.mongodb.master'));
}

$util.inherits(UserMongo, Mongo);

module.exports = exports = UserMongo;
