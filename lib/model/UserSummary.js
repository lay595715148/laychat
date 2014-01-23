var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');
/**
 * 用户总述对象
 */
function UserSummary(id, name, nick, socket, channel, layer, status) {
    this.id = 0;//用户ID
    this.name = '';//用户名称
    this.nick = '';//用户昵称
    this.socket = '';//用户当前socket的ID
    this.channel = 0;//所在当前频道
    this.layer = 0;//所在当前频道层
    this.status = 0;//当前状态
    
    if(Utilities.isObject(id)) {
        id = id.id;
        name = id.name;
        nick = id.nick;
        socket = id.socket;
        channel = id.channel;
        layer = id.layer;
    }
    
    this.setId(id);
    this.setName(name);
    this.setNick(nick);
    this.setSocket(socket);
    this.setChannel(channel);
    this.setLayer(layer);
    this.setStatus(status);
}

module.exports = exports = UserSummary;

/**
 * 
 * @param id {Number}
 */
UserSummary.prototype.setId = function(id) {
    if(Utilities.isNumber(id))
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
UserSummary.prototype.setName = function(name) {
    if(Utilities.isString(name))
        this.name = name;
};
/**
 * 
 * @param nick {String}
 */
UserSummary.prototype.setNick = function(nick) {
    if(Utilities.isString(nick))
        this.nick = nick;
};
/**
 * user current socket id
 * @param socket {String}
 */
UserSummary.prototype.setSocket = function(socket) {
    if(Utilities.isObject(socket) && Utilities.isString(socket.id))
        this.socket = socket.id;
    else if(Utilities.isString(socket))
        this.socket = socket;
};
/**
 * user current channel id
 * @param channel {Number}
 */
UserSummary.prototype.setChannel = function(channel) {
    if(Utilities.isObject(channel) && Utilities.isNumber(channel.id))
        this.channel = channel.id;
    else if(Utilities.isNumber(channel))
        this.channel = channel;
};
/**
 * user current layer id
 * @param layer {Number}
 */
UserSummary.prototype.setLayer = function(layer) {
    if(Utilities.isObject(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
        this.layer = layer.id;
    else if(Utilities.isNumber(layer) || '' === layer)
        this.layer = layer;
};
/**
 * user current status
 * @param status {String}
 */
UserSummary.prototype.setStatus = function(status) {
    if(Utilities.isNumber(status) || Utilities.isString(status))
        this.status = status;
};
/**]
 * 
 * @returns {User}
 */
UserSummary.prototype.toUser = function() {
    var User = require('./User');
    return new User(this);
};
/**
 * 
 * @returns {Object}
 */
UserSummary.prototype.toJson = function() {
    return {'id':this.id, 'name':this.name, 'nick':this.nick, 'socket':this.socket, 'channel':this.channel, 'layer':this.status, 'layer':this.status};
};


/**
 * 通过令牌码生成用户对象
 * @param token string
 * @returns {UserSummary}
 */
UserSummary.generateByToken = function(token) {
    var us = new UserSummary();
    us.setId(Math.floor(Math.random() * 100000));
    us.setName('lay' + us.id);
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
    if(Utilities.isArray(list)) {
        for(var i = 0; i < list.length; i++) {
            if(!Utilities.isA(list[i], UserSummary)) {
                return null;
            }
        }
    }
    return Collector.list(list, total, hasNext);
};
