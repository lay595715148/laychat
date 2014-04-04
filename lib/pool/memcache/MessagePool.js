var MemcachePool = $.pool.MemcachePool;
var Message = $.model.Message;
var Store = $.core.Store;

function MessagePool() {
    MemcachePool.call(this, 'message', Message, Store.factory('store.memcache.MessageMemcache'));
}

$util.inherits(MessagePool, MemcachePool);

module.exports = exports = MessagePool;

MessagePool.prototype.open = function(fn) {
    this.super('open', {}, fn);
};
