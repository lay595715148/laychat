var Memcache = require('../store/Memcache');

function MemcacheMaster(model) {
    Memcache.call(this, model, $config.get('servers.memcache.master'));
}

$util.inherits(MemcacheMaster, Memcache);

module.exports = exports = MemcacheMaster;
