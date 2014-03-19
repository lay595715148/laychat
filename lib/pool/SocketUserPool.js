var CachePool = $require('pool.CachePool');
var SocketUser = $require('model.SocketUser');

function SocketUserPool() {
    CachePool.call(this, 'socketUser');
}

$util.inherits(SocketUserPool, CachePool);

module.exports = exports = SocketUserPool;
