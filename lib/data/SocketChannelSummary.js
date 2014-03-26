var Collector = $require('util.Collector');

/**
 * 频道对象综述对象
 */
function SocketChannelSummary(id, name, layer, namespace, users) {
    var _id = 0, _name = '', _layer = 0, _users = {};
    
    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        layer = tmp.layer;
        users = tmp.users || {};
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineSetter__('layer', function(layer) {
        if($util.isObject(layer) && !$util.isNull(layer) && ($util.isNumber(layer.id) || '' === layer.id))
            _layer = layer.id;
        else if($util.isNumber(layer) || '' === layer)
            _layer = layer;
    });
    this.__defineSetter__('users', function(users) {
        if($util.isObject(users) && !$util.isEmpty(users))
            _users = users;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('layer', function() {
        return _layer;
    });
    this.__defineGetter__('users', function() {
        return _users;
    });
    
    this.id = id;//ID
    this.name = name;//名称
    this.layer = layer;//默认层
    this.users = users;//当前频道的所有用户索引//socketid=>UserSummary
}

module.exports = exports = SocketChannelSummary;

/**
 * 
 * @param id {Number}
 */
SocketChannelSummary.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
SocketChannelSummary.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
SocketChannelSummary.prototype.setLayer = function(layer) {
    this.layer = layer;
};
/**
 * 
 * @param users {Object}
 */
SocketChannelSummary.prototype.setUsers = function(users) {
    this.users = users;
};
/**
 * 
 * @returns {Number}
 */
SocketChannelSummary.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @returns {String}
 */
SocketChannelSummary.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @returns {Number}
 */
SocketChannelSummary.prototype.getLayer = function() {
    return this.layer;
};
/**
 * 
 * @returns {Object}
 */
SocketChannelSummary.prototype.getUsers = function() {
    return this.users;
};

/**
 * 通过socket的对象或ID获取当前频道内的用户
 * @param socket {Object}
 * @returns {UserSummary}
 */
SocketChannelSummary.prototype.getUserBySocket = function(socket) {
    if($util.isObject(socket) && $util.isDefined(socket.id) && $util.isDefined(this.users[socket.id]))
        return this.users[socke.id];
    else if($util.isString(socket) && $util.isDefined(this.users[socket]))
        return this.users[socket];
    else 
        return null;
};
/**
 * 
 * @param namespace {Object} socket namespace
 * @returns {Boolean}
 */
SocketChannelSummary.prototype.cleanUser = function(namespace) {
    var clients = namespace.clients(), tmpusers = {}, tmpids = {};
    //从数组中搜索指定值，可优化
    for(var i = 0; i < clients.length; i++) {
        tmpusers[clients[i].id] = true;
    }
    for(var id in this.users) {
        tmpids[id] = true;
        if($util.isUndefined(tmpusers[id])) {
            this.removeUser(this.users[id]);
        }
    }
    return true;
};
/**
 * 增加user
 * @param {UserSummary} user
 */
SocketChannelSummary.prototype.appendUser = function(user) {
    if($util.isObject(user) && $util.isString(user.socket))
        this.users[user.socket] = user;
};
/**
 * 删除user
 * @param {UserSummary} user
 */
SocketChannelSummary.prototype.removeUser = function(user) {
    if($util.isObject(user) && $util.isString(user.socket))
        delete this.users[user.socket];
};
/**
 * 转换为简单的Channel对象
 * @returns {Channel}
 */
SocketChannelSummary.prototype.toChannel = function() {
    var Channel = $require('model.Channel');
    return new Channel(this);
};

/**
 * 
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 * @returns {Object}
 */
SocketChannelSummary.list = function(list, total, hasNext) {
    var cses = [];
    if($util.isArray(list)) {
        list.forEach(function(item) {
            if($util.isA(item, SocketChannelSummary)) {
                cses.push(item);
            }
        });
    }
    return Collector.list(cses, $util.isNumber(total)?total:cses.length, $util.isBoolean(hasNext)?hasNext:false);
};
