var MemcachePool = $require('pool.MemcachePool');
var Message = $require('model.Message');
var Store = $require('store.Store');

function MessagePool() {
    MemcachePool.call(this, 'message', Store.factory('MessageMemcache'));
}

$util.inherits(MessagePool, MemcachePool);

module.exports = exports = MessagePool;
