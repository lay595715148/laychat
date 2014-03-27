var Validater = $.util.Validater;
var User = $.model.User;
var Manager = $.core.Manager;
var Processer = $.core.Processer;
var Entity = $.core.Entity;

// 用户管理器
function UserManager(io) {
    this.io = io;
}

$util.inherits(UserManager, Manager);

module.exports = exports = UserManager;

UserManager.prototype.create = function(fn) {
    var io = this.io;
    if(!$util.isObject(io))
        return null;

    io.of('/user').on('connection', function(socket) {
        var su = Entity.instance('SocketUser');
        var up = Processer.instance('UserProcesser', su);
        su.setSocket(socket);
        up.init();
        $util.isFunction(fn) && fn(true);
        $logger.debug('do connect in UserManager');
    });
    $logger.info('user socket is ready!');
};
