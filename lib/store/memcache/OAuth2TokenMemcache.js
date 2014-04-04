var MMemcache = $.store.MMemcache;
var OAuth2Token = $.model.OAuth2Token;

function OAuth2TokenMemcache() {
    MMemcache.call(this, OAuth2Token, $config.get('servers.memcache.master'));
}

$util.inherits(OAuth2TokenMemcache, MMemcache);

module.exports = exports = OAuth2TokenMemcache;
