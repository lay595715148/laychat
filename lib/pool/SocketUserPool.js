var EntityPool = $require('pool.EntityPool');
var SocketUser = $require('entity.SocketUser');

function SocketUserPool() {
    EntityPool.call(this, 'socketUser', SocketUser);
}

$util.inherits(SocketUserPool, EntityPool);

module.exports = exports = SocketUserPool;
