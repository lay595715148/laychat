var Mongo = require('../store/Mongo');
var OAuth2Token = require('../model/OAuth2Token');

function OAuth2TokenStore() {
    Mongo.call(this, OAuth2Token, $config.get('servers.mongodb.master'));
}

$util.inherits(OAuth2TokenStore, Mongo);

module.exports = exports = OAuth2TokenStore;
