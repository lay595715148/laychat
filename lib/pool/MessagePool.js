var MemcachePool = $require('pool.MemcachePool');
var Message = $require('model.Message');
var Store = $require('core.Store');

function MessagePool() {
    MemcachePool.call(this, 'message', Message, Store.factory('MessageMemcache'));
}

$util.inherits(MessagePool, MemcachePool);

module.exports = exports = MessagePool;
