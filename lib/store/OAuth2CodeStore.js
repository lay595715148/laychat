var Mongo = $.store.Mongo;
var OAuth2Code = $.model.OAuth2Code;

function OAuth2CodeStore() {
    Mongo.call(this, OAuth2Code, $config.get('servers.mongodb.master'));
}

$util.inherits(OAuth2CodeStore, Mongo);

module.exports = exports = OAuth2CodeStore;
