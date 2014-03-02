var Memcache = require('../store/Memcache');
var Client = require('../model/Client');

function ClientMemcache() {
    Memcache.call(this, Client, $config.get('servers.mongodb.master'));
}

$util.inherits(ClientMemcache, Memcache);

module.exports = exports = ClientMemcache;


