var Mongo = require('../store/Mongo');
var User = require('../model/User');

function UserStore() {
    Mongo.call(this, User, $config.get('servers.mongodb.master'));
}

$util.inherits(UserStore, Mongo);

module.exports = exports = UserStore;


