var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');
/**
 * 用户总述对象
 */
function UserSocketSummary(id, name, nick, socket, channel, layer, status) {
    this.id = 0;//用户ID
    this.name = '';//用户名称
    this.nick = '';//用户昵称
    this.socket = '';//用户当前socket的ID
    this.channel = 0;//所在当前频道
    this.layer = 0;//所在当前频道层
    this.status = '';//当前状态
    
    if(Utilities.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        nick = tmp.nick;
        socket = tmp.socket || '';
        channel = tmp.channel || 0;
        layer = tmp.layer || 0;
        status = tmp.status || '';
    }
    
    this.setId(id);
    this.setName(name);
    this.setNick(nick);
    this.setSocket(socket);
    this.setChannel(channel);
    this.setLayer(layer);
    this.setStatus(status);
}

module.exports = exports = UserSocketSummary;

/**
 * 
 * @param id {Number}
 */
UserSocketSummary.prototype.setId = function(id) {
    if(Utilities.isNumber(id))
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
UserSocketSummary.prototype.setName = function(name) {
    if(Utilities.isString(name))
        this.name = name;
};
/**
 * 
 * @param nick {String}
 */
UserSocketSummary.prototype.setNick = function(nick) {
    if(Utilities.isString(nick))
        this.nick = nick;
};
/**
 * user current socket id
 * @param socket {String}
 */
UserSocketSummary.prototype.setSocket = function(socket) {
    if(Utilities.isObject(socket) && Utilities.isString(socket.id))
        this.socket = socket.id;
    else if(Utilities.isString(socket))
        this.socket = socket;
};
/**
 * user current channel id
 * @param channel {Number}
 */
UserSocketSummary.prototype.setChannel = function(channel) {
    if(Utilities.isObject(channel) && Utilities.isNumber(channel.id))
        this.channel = channel.id;
    else if(Utilities.isNumber(channel))
        this.channel = channel;
};
/**
 * user current layer id
 * @param layer {Number}
 */
UserSocketSummary.prototype.setLayer = function(layer) {
    if(Utilities.isObject(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
        this.layer = layer.id;
    else if(Utilities.isNumber(layer) || '' === layer)
        this.layer = layer;
};
/**
 * user current status
 * @param status {String}
 */
UserSocketSummary.prototype.setStatus = function(status) {
    if(Utilities.isNumber(status) || Utilities.isString(status))
        this.status = status;
};
/**]
 * 
 * @returns {User}
 */
UserSocketSummary.prototype.toUser = function() {
    var User = require('../model/User');
    return new User(this);
};


/**
 * 通过令牌码生成用户对象
 * @param token string
 * @returns {UserSocketSummary}
 */
UserSocketSummary.generateByToken = function(token) {
    var us = new UserSocketSummary();
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
UserSocketSummary.list = function(list, total, hasNext) {
    var uses = [];
    if(Utilities.isArray(list)) {
        list.forEach(function(item) {
            if(Utilities.isA(item, UserSocketSummary)) {
                uses.push(item);
            }
        });
    }
    return Collector.list(uses, Utilities.isNumber(total)?total:uses.length, Utilities.isBoolean(hasNext)?hasNext:false);
};
