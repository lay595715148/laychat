var EntityPool = $.pool.EntityPool;
var SocketUser = $.entity.SocketUser;

function SocketUserPool() {
    EntityPool.call(this, 'socketUser', SocketUser);
}

$util.inherits(SocketUserPool, EntityPool);

module.exports = exports = SocketUserPool;

SocketUserPool.prototype.open = function(fn) {
    this.super('open', {}, fn);
};
