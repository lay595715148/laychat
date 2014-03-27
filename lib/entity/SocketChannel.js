var Entity = $.core.Entity;
var Collector = $.util.Collector;
var SocketChannelSummary = $.data.SocketChannelSummary;

/**
 * 频道对象综述对象
 */
function SocketChannel(id, name, layer, namespace, users) {
    var _id = 0, _name = '', _layer = 0, _namespace = {}, _users = {};
    
    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        layer = tmp.layer;
        namespace = tmp.namespace || {};
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
    this.__defineSetter__('namespace', function(namespace) {
        if($util.isObject(namespace) && !$util.isNull(namespace))
            _namespace = namespace;
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
    this.__defineGetter__('namespace', function() {
        return _namespace;
    });
    this.__defineGetter__('users', function() {
        return _users;
    });
    
    this.id = id;//ID
    this.name = name;//名称
    this.layer = layer;//默认层
    this.namespace = namespace;//默认层
    this.users = users;//当前频道的所有用户索引//socketid=>UserSummary
}

$util.inherits(SocketChannel, Entity);

module.exports = exports = SocketChannel;

/**
 * 
 * @param id {Number}
 */
SocketChannel.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
SocketChannel.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
SocketChannel.prototype.setLayer = function(layer) {
    this.layer = layer;
};
/**
 * 
 * @param layer {Number}
 */
SocketChannel.prototype.setNamespace = function(namespace) {
    this.namespace = namespace;
};
/**
 * 
 * @param users {Object}
 */
SocketChannel.prototype.setUsers = function(users) {
    this.users = users;
};
/**
 * 
 * @returns {Number}
 */
SocketChannel.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @returns {String}
 */
SocketChannel.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @returns {Number}
 */
SocketChannel.prototype.getLayer = function() {
    return this.layer;
};
/**
 * 
 * @returns {Number}
 */
SocketChannel.prototype.getNamespace = function() {
    return this.namespace;
};
/**
 * 
 * @returns {Object}
 */
SocketChannel.prototype.getUsers = function() {
    return this.users;
};

/**
 * 通过socket的对象或ID获取当前频道内的用户
 * @param socket {Object}
 * @returns {UserSummary}
 */
SocketChannel.prototype.getUserBySocket = function(socket) {
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
SocketChannel.prototype.cleanUser = function() {
    var namespace = this.namespace, clients = namespace.clients(), tmpusers = {}, tmpids = {};
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
 * @param {SocketUser} user
 */
SocketChannel.prototype.appendUser = function(user) {
    if($util.isObject(user) && $util.isString(user.socket))
        this.users[user.socket] = user;
    else if($util.isObject(user) && $util.isObject(user.socket) && $util.isString(user.socket.id))
        this.users[user.socket.id] = user;
};
/**
 * 删除user
 * @param {UserSummary} user
 */
SocketChannel.prototype.removeUser = function(user) {
    if($util.isObject(user) && $util.isString(user.socket))
        delete this.users[user.socket];
    else if($util.isObject(user) && $util.isObject(user.socket) && $util.isString(user.socket.id))
        delete this.users[user.socket.id];
};
/**
 * 转换为简单的Channel对象
 * @returns {Channel}
 */
SocketChannel.prototype.toChannel = function() {
    var Channel = $.model.Channel;
    return new Channel(this);
};
/**
 * 转换为简单的Channel对象
 * @returns {Channel}
 */
SocketChannel.prototype.toSocketChannelSummary = function() {
    return new SocketChannelSummary(this);
};

/**
 * 主键属性名
 * @abstract
 */
SocketChannel.key = SocketChannel.prototype.key = function() {
    return 'id';
};
