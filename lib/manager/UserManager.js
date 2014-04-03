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

UserManager.prototype.open = function(fn) {
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
/**
 * 
 * @param {ChannelSummary} cs
 * @returns {Boolean}
 */
UserManager.prototype.close = function(fn) {
    var clients;
    if(!$util.isObject(io)) {
        $util.isFunction(fn) && fn(false);
        return false;
    }

    clients = this.io.of('/user').clients();
    
    for(var i = 0; i < clients.length; i++) {
        clients[i].removeAllListeners();
        clients[i].disconnect();
        //delete io.sockets.sockets[clients[i].id];
    }
    this.io.of('/user').removeAllListeners();
    delete this.io.namespaces['/user'];
    $util.isFunction(fn) && fn(true);
};
