var Validater = require('../util/Validater');
var Processer = require('../processer/Processer');

function MessageProcesser(socketUser, message) {
    this.socketUser = socketUser;
}

$util.inherits(MessageProcesser, Processer);

module.exports = exports = MessageProcesser;

/**
 * 发布当前消息
 */
MessageProcesser.prototype.release = function() {
    return false;
};
/**
 * 当前消息存入缓存数据库
 */
MessageProcesser.prototype.cache = function() {
    return false;
};
