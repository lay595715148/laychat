var User = require('./User');
var util = require('util');
var Utilities = require('../util/Utilities');
/**
 * 用户总述对象
 */
function UserSummary() {
    this.id = 0;//用户ID
    this.name = '';//用户名称
    this.nick = '';//用户昵称
    this.socket = 0;//用户当前socket的ID
    this.channel = 0;//所在当前频道
    this.layer = 0;//所在当前频道层
    this.status = 0;//当前状态
}
UserSummary.prototype.setId = function(id) {
    this.id = id;
};
UserSummary.prototype.setName = function(name) {
    this.name = name;
};
UserSummary.prototype.setNick = function(nick) {
    this.nick = nick;
};
UserSummary.prototype.setSocket = function(socket) {
    if('object' === typeof socket)
        this.socket = socket.id;
    else 
        this.socket = socket;
};
UserSummary.prototype.setChannel = function(channel) {
    if('object' === typeof channel)
        this.channel = channel.id;
    else 
        this.channel = channel;
};
UserSummary.prototype.setLayer = function(layer) {
    if('object' === typeof layer)
        this.layer = layer.id;
    else 
        this.layer = layer;
};
UserSummary.prototype.setStatus = function(status) {
    this.status = status;
};
UserSummary.prototype.toUser = function() {
    var u = new User();
    u.setId(this.id);
    u.setName(this.name);
    u.setNick(this.nick);
    return u;
};
UserSummary.prototype.toJson = function() {
    console.log('do toJson');
    return {'id':this.id, 'name':this.name, 'nick':this.nick, 'socket':this.socket, 'channel':this.channel, 'layer':this.status, 'layer':this.status};
};

/**
 * 通过令牌码生成用户对象
 * @param token string
 * @returns {UserSummary}
 */
UserSummary.generateByToken = function(token) {
    var us = new UserSummary();
    console.log('do UserSummary');
    us.setId(Math.floor(Math.random() * 100000));
    us.setName('lay');
    us.setNick('admin');
    return us;
};
/**
 * 
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 * @returns {Object}
 */
UserSummary.list = function(list, total, hasNext) {
    if(util.isArray(list)) {
        for(var i = 0; i < list.length; i++) {
            if(!(list[i] instanceof UserSummary)) {
                return null;
            }
        }
    }
    return Utilities.list(list, total, hasNext);
};

module.exports = exports = UserSummary;