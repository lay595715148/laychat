var Validater = require('../util/Validater');
var User = require('../model/User');
var Manager = require('../manager/Manager');

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
        var su = new SocetUser();
        su.setSocket(socket);
        Processer.instance('UserProcesser', su).init();
        $util.isFunction(fn) && fn(true);
        $logger.debug('do connect in UserManager', sc.id);
    });
    $logger.info('user socket is ready!');
};
