var Mongo = $.store.Mongo;
var OAuth2Code = $.model.OAuth2Code;

function OAuth2CodeMongo() {
    Mongo.call(this, OAuth2Code, $config.get('servers.mongodb.master'));
}

$util.inherits(OAuth2CodeMongo, Mongo);

module.exports = exports = OAuth2CodeMongo;
