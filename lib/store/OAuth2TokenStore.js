var Mongo = $.store.Mongo;
var OAuth2Token = $.model.OAuth2Token;

function OAuth2TokenStore() {
    Mongo.call(this, OAuth2Token, $config.get('servers.mongodb.master'));
}

$util.inherits(OAuth2TokenStore, Mongo);

module.exports = exports = OAuth2TokenStore;
