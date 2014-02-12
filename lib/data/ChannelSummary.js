var Utilities = require('../util/Utilities');

/**
 * 频道对象综述对象
 */
function ChannelSummary(id, name, layer, namespace, users) {
    this.id = 0;
    this.name = '';
    this.layer = 0;//默认层
    this.users = {};//当前频道的所有用户索引//socketid=>UserSummary
    
    if('object' === typeof id) {
        id = id.id;
        name = id.name;
        layer = id.layer;
        users = id.users;
    }
    
    this.setId(id);
    this.setName(name);
    this.setLayer(layer);
    this.setUsers(users);
}

module.exports = exports = ChannelSummary;

/**
 * 
 * @param id {Number}
 */
ChannelSummary.prototype.setId = function(id) {
    if(Utilities.isNumber(id))
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
ChannelSummary.prototype.setName = function(name) {
    if(Utilities.isString(name))
        this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
ChannelSummary.prototype.setLayer = function(layer) {
    if(Utilities.isObject(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
        this.layer = layer.id;
    else if(Utilities.isNumber(layer) || '' === layer)
        this.layer = layer;
};
/**
 * 
 * @param users {Object}
 */
ChannelSummary.prototype.setUsers = function(users) {
    if(Utilities.isObject(users))
        this.users = users;
};
/**
 * 通过socket的对象或ID获取当前频道内的用户
 * @param socket {Object}
 * @returns {UserSummary}
 */
ChannelSummary.prototype.getUserBySocket = function(socket) {
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
ChannelSummary.prototype.cleanUser = function(namespace) {
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
    $logger.debug('clean users in channel', this.id, tmpusers, tmpids);
    return true;
};
/**
 * 增加user
 * @param {UserSummary} user
 */
ChannelSummary.prototype.appendUser = function(user) {
    if(Utilities.isObject(user) && Utilities.isString(user.socket))
        this.users[user.socket] = user;
};
/**
 * 删除user
 * @param {UserSummary} user
 */
ChannelSummary.prototype.removeUser = function(user) {
    if(Utilities.isObject(user) && Utilities.isString(user.socket))
        delete this.users[user.socket];
};
/**
 * 转换为简单的Channel对象
 * @returns {Channel}
 */
ChannelSummary.prototype.toChannel = function() {
    var Channel = require('../model/Channel');
    return new Channel(this);
};
/**
 * 通过频道ID生成频道对象
 * @param id
 * @param token
 * @returns {ChannelSummary}
 */
ChannelSummary.generateById = function(id) {
    var cs = new ChannelSummary();
    cs.setId(id);
    cs.setName('global');
    cs.setLayer(Math.floor(Math.random() * 1000));
    return cs;
};

