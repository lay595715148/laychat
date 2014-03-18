var ModelPool = $require('pool.ModelPool');
var User = $require('model.User');

function UserPool() {
    ModelPool.call(this, 'user', User);
}

$util.inherits(UserPool, ModelPool);

module.exports = exports = UserPool;
