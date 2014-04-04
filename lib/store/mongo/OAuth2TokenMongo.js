var Mongo = $.store.Mongo;
var OAuth2Token = $.model.OAuth2Token;

function OAuth2TokenMongo() {
    Mongo.call(this, OAuth2Token, $config.get('servers.mongodb.master'));
}

$util.inherits(OAuth2TokenMongo, Mongo);

module.exports = exports = OAuth2TokenMongo;
