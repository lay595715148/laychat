var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');
var Data = require('../data/Data');

/**
 * 用户总述对象
 */
function UserSocketSummary(id, name, nick, socket, channel, layer, status) {
    var _id = 0, _name = '', _nick = '', _socket = '', _channel = 0, _layer = 0, _status = '';

    if(Utilities.isObject(id) && !Utilities.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        nick = tmp.nick;
        socket = tmp.socket || '';
        channel = tmp.channel || 0;
        layer = tmp.layer || 0;
        status = tmp.status || '';
    }

    // 一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if(Utilities.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if(Utilities.isString(name))
            _name = name;
    });
    this.__defineSetter__('nick', function(nick) {
        if(Utilities.isString(nick))
            _nick = nick;
    });
    this.__defineSetter__('socket', function(socket) {
        if(Utilities.isObject(socket) && !Utilities.isNull(socket) && Utilities.isString(socket.id))
            _socket = socket.id;
        else if(Utilities.isString(socket))
            _socket = socket;
    });
    this.__defineSetter__('channel', function(channel) {
        if(Utilities.isObject(channel) && !Utilities.isNull(channel) && Utilities.isNumber(channel.id))
            _channel = channel.id;
        else if(Utilities.isNumber(channel))
            _channel = channel;
    });
    this.__defineSetter__('layer', function(layer) {
        if(Utilities.isObject(layer) && !Utilities.isNull(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
            _layer = layer.id;
        else if(Utilities.isNumber(layer) || '' === layer)
            _layer = layer;
    });
    this.__defineSetter__('status', function(status) {
        if(Utilities.isNumber(status) || Utilities.isString(status))
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

Utilities.inherits(UserSocketSummary, Data);

module.exports = exports = UserSocketSummary;

/**
 * 
 * @param id
 *            {Number}
 */
UserSocketSummary.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name
 *            {String}
 */
UserSocketSummary.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param nick
 *            {String}
 */
UserSocketSummary.prototype.setNick = function(nick) {
    this.nick = nick;
};
/**
 * user current socket id
 * 
 * @param socket
 *            {String}
 */
UserSocketSummary.prototype.setSocket = function(socket) {
    this.socket = socket;
};
/**
 * user current channel id
 * 
 * @param channel
 *            {Number}
 */
UserSocketSummary.prototype.setChannel = function(channel) {
    this.channel = channel;
};
/**
 * user current layer id
 * 
 * @param layer
 *            {Number}
 */
UserSocketSummary.prototype.setLayer = function(layer) {
    this.layer = layer;
};
/**
 * user current status
 * 
 * @param status
 *            {String}
 */
UserSocketSummary.prototype.setStatus = function(status) {
    this.status = status;
};
/**
 * 
 * @returns {Number}
 */
UserSocketSummary.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @returns {String}
 */
UserSocketSummary.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @returns {String}
 */
UserSocketSummary.prototype.getNick = function() {
    return this.nick;
};
/**
 * @param socket
 *            {String}
 */
UserSocketSummary.prototype.getSocket = function() {
    return this.socket;
};
/**
 * user current channel id
 * 
 * @returns {Number}
 */
UserSocketSummary.prototype.getChannel = function() {
    return this.channel;
};
/**
 * @returns {Number}
 */
UserSocketSummary.prototype.getLayer = function() {
    return this.layer;
};
/**
 * @returns {String}
 */
UserSocketSummary.prototype.getStatus = function() {
    return this.status;
};

/**
 * 
 * @returns {User}
 */
UserSocketSummary.prototype.toUser = function() {
    var User = require('../model/User');
    return new User(this);
};

/**
 * 
 * @param list
 *            {Array}
 * @param total
 *            {Number}
 * @param hasNext
 *            {Boolean}
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
    return Collector.list(uses, Utilities.isNumber(total) ? total : uses.length, Utilities.isBoolean(hasNext) ? hasNext
            : false);
};
