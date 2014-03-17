var Collector = require('../util/Collector');
var SocketUserSummary = require('../data/SocketUserSummary');

/**
 * 用户总述对象
 */
function SocketUser(id, name, nick, socket, channel, layer, status) {
    var _id = 0, _name = '', _nick = '', _socket = {}, _channel = {}, _layer = 0, _status = '';

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        nick = tmp.nick;
        socket = tmp.socket || {};
        channel = tmp.channel || {};
        layer = tmp.layer || 0;
        status = tmp.status || '';
    }

    // 一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineSetter__('nick', function(nick) {
        if($util.isString(nick))
            _nick = nick;
    });
    this.__defineSetter__('socket', function(socket) {
        if($util.isObject(socket) && !$util.isNull(socket))
            _socket = socket;
    });
    this.__defineSetter__('channel', function(channel) {
        if($util.isObject(channel) && !$util.isNull(channel))
            _channel = channel;
    });
    this.__defineSetter__('layer', function(layer) {
        if($util.isObject(layer) && !$util.isNull(layer) && ($util.isNumber(layer.id) || '' === layer.id))
            _layer = layer.id;
        else if($util.isNumber(layer) || '' === layer)
            _layer = layer;
    });
    this.__defineSetter__('status', function(status) {
        if($util.isNumber(status) || $util.isString(status))
            _status = status;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('nick', function() {
        return _nick;
    });
    this.__defineGetter__('socket', function() {
        return _socket;
    });
    this.__defineGetter__('channel', function() {
        return _channel;
    });
    this.__defineGetter__('layer', function() {
        return _layer;
    });
    this.__defineGetter__('status', function() {
        return _status;
    });

    this.id = id;// 用户ID
    this.name = name;// 用户名称
    this.nick = nick;// 用户昵称
    this.socket = socket;// 用户当前socket的ID
    this.channel = channel;// 所在当前频道
    this.layer = layer;// 所在当前频道层
    this.status = status;// 当前状态
}

module.exports = exports = SocketUser;

/**
 * 
 * @param id
 *            {Number}
 */
SocketUser.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name
 *            {String}
 */
SocketUser.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param nick
 *            {String}
 */
SocketUser.prototype.setNick = function(nick) {
    this.nick = nick;
};
/**
 * user current socket id
 * 
 * @param socket
 *            {String}
 */
SocketUser.prototype.setSocket = function(socket) {
    this.socket = socket;
};
/**
 * user current channel id
 * 
 * @param channel
 *            {Number}
 */
SocketUser.prototype.setChannel = function(channel) {
    this.channel = channel;
};
/**
 * user current layer id
 * 
 * @param layer
 *            {Number}
 */
SocketUser.prototype.setLayer = function(layer) {
    this.layer = layer;
};
/**
 * user current status
 * 
 * @param status
 *            {String}
 */
SocketUser.prototype.setStatus = function(status) {
    this.status = status;
};
/**
 * 
 * @returns {Number}
 */
SocketUser.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @returns {String}
 */
SocketUser.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @returns {String}
 */
SocketUser.prototype.getNick = function() {
    return this.nick;
};
/**
 * @param socket
 *            {String}
 */
SocketUser.prototype.getSocket = function() {
    return this.socket;
};
/**
 * user current channel id
 * 
 * @returns {Number}
 */
SocketUser.prototype.getChannel = function() {
    return this.channel;
};
/**
 * @returns {Number}
 */
SocketUser.prototype.getLayer = function() {
    return this.layer;
};
/**
 * @returns {String}
 */
SocketUser.prototype.getStatus = function() {
    return this.status;
};

SocketUser.prototype.mergeUser = function(user) {
    this.id = user.id;
    this.name = user.name;
    this.nick = user.nick;
};
/**
 * 
 * @returns {User}
 */
SocketUser.prototype.toUser = function() {
    var User = require('../model/User');
    return new User(this);
};
/**
 * 
 * @returns {User}
 */
SocketUser.prototype.toSocketUserSummary = function() {
    return new SocketUserSummary(this);
};
