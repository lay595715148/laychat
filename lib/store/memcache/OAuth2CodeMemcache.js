var MMemcache = $.store.MMemcache;
var OAuth2Code = $.model.OAuth2Code;

function OAuth2CodeMemcache() {
    MMemcache.call(this, OAuth2Code, $config.get('servers.memcache.master'));
}

$util.inherits(OAuth2CodeMemcache, MMemcache);

module.exports = exports = OAuth2CodeMemcache;
