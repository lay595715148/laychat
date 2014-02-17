var Utilities = require('../util/Utilities');

/**
 * 频道对象综述对象
 */
function ChannelSocketSummary(id, name, layer, namespace, users) {
    this.id = 0;
    this.name = '';
    this.layer = 0;//默认层
    this.users = {};//当前频道的所有用户索引//socketid=>UserSummary
    
    if(Utilities.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        layer = tmp.layer;
        users = tmp.users || {};
    }
    
    this.setId(id);
    this.setName(name);
    this.setLayer(layer);
    this.setUsers(users);
}

module.exports = exports = ChannelSocketSummary;

/**
 * 
 * @param id {Number}
 */
ChannelSocketSummary.prototype.setId = function(id) {
    if(Utilities.isNumber(id))
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
ChannelSocketSummary.prototype.setName = function(name) {
    if(Utilities.isString(name))
        this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
ChannelSocketSummary.prototype.setLayer = function(layer) {
    if(Utilities.isObject(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
        this.layer = layer.id;
    else if(Utilities.isNumber(layer) || '' === layer)
        this.layer = layer;
};
/**
 * 
 * @param users {Object}
 */
ChannelSocketSummary.prototype.setUsers = function(users) {
    if(Utilities.isObject(users))
        this.users = users;
};
/**
 * 通过socket的对象或ID获取当前频道内的用户
 * @param socket {Object}
 * @returns {UserSummary}
 */
ChannelSocketSummary.prototype.getUserBySocket = function(socket) {
    if(Utilities.isObject(socket) && Utilities.isDefined(socket.id) && Utilities.isDefined(this.users[socket.id]))
        return this.users[socke.id];
    else if(Utilities.isString(socket) && Utilities.isDefined(this.users[socket]))
        return this.users[socket];
    else 
        return null;
};
/**
 * 
 * @param namespace {Object} socket namespace
 * @returns {Boolean}
 */
ChannelSocketSummary.prototype.cleanUser = function(namespace) {
    var clients = namespace.clients(), tmpusers = {}, tmpids = {};
    //从数组中搜索指定值，可优化
    for(var i = 0; i < clients.length; i++) {
        tmpusers[clients[i].id] = true;
    }
    for(var id in this.users) {
        tmpids[id] = true;
        if(Utilities.isUndefined(tmpusers[id])) {
            this.removeUser(this.users[id]);
        }
    }
    //$logger.debug('clean users in channel', this.id, tmpusers, tmpids);
    return true;
};
/**
 * 增加user
 * @param {UserSummary} user
 */
ChannelSocketSummary.prototype.appendUser = function(user) {
    if(Utilities.isObject(user) && Utilities.isString(user.socket))
        this.users[user.socket] = user;
};
/**
 * 删除user
 * @param {UserSummary} user
 */
ChannelSocketSummary.prototype.removeUser = function(user) {
    if(Utilities.isObject(user) && Utilities.isString(user.socket))
        delete this.users[user.socket];
};
/**
 * 转换为简单的Channel对象
 * @returns {Channel}
 */
ChannelSocketSummary.prototype.toChannel = function() {
    var Channel = require('../model/Channel');
    return new Channel(this);
};
/**
 * 
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 * @returns {Object}
 */
ChannelSocketSummary.list = function(list, total, hasNext) {
    var cses = [];
    if(Utilities.isArray(list)) {
        list.forEach(function(item) {
            if(Utilities.isA(item, ChannelSocketSummary)) {
                cses.push(item);
            }
        });
    }
    return Collector.list(cses, Utilities.isNumber(total)?total:cses.length, Utilities.isBoolean(hasNext)?hasNext:false);
};
/**
 * 通过频道ID生成频道对象
 * @param id
 * @param token
 * @returns {ChannelSocketSummary}
 */
ChannelSocketSummary.generateById = function(id) {
    var cs = new ChannelSocketSummary();
    cs.setId(id);
    cs.setName('global');
    cs.setLayer(Math.floor(Math.random() * 1000));
    return cs;
};

