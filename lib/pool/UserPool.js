var ModelPool = $.pool.ModelPool;
var User = $.model.User;

function UserPool() {
    ModelPool.call(this, 'user', User);
}

$util.inherits(UserPool, ModelPool);

module.exports = exports = UserPool;
