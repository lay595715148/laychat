var Validater = require('../util/Validater');
var User = require('../model/User');
var Pool = require('../pool/Pool');
var Manager = require('../manager/Manager');
var Processer = require('../processer/Processer');
var SocketUser = require('../entity/SocketUser');

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
        var su = new SocketUser();
        su.setSocket(socket);
        Pool.factory('SocketUserPool');
        Processer.instance('UserProcesser', su).init();
        $util.isFunction(fn) && fn(true);
        $logger.debug('do connect in UserManager');
    });
    $logger.info('user socket is ready!');
};
