var Memcache = require('../store/Memcache');
var OAuth2Token = require('../model/OAuth2Token');

function OAuth2TokenMemcache() {
    Memcache.call(this, OAuth2Token, $config.get('servers.memcache.master'));
}

$util.inherits(OAuth2TokenMemcache, Memcache);

module.exports = exports = OAuth2TokenMemcache;
