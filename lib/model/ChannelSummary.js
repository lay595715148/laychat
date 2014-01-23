var Utilities = require('../util/Utilities');

/**
 * 频道对象综述对象
 */
function ChannelSummary(id, name, layer, namespace, users) {
    this.id = 0;
    this.name = '';
    this.layer = 0;//默认层
    this.namespace = '';
    this.users = {};//当前频道的所有用户索引//socketid=>UserSummary
    
    if('object' === typeof id) {
        id = id.id;
        name = id.name;
        layer = id.layer;
        namespace = id.namespace;
        users = id.users;
    }
    
    this.setId(id);
    this.setName(name);
    this.setLayer(layer);
    this.setNamespace(namespace);
    this.setUsers(users);
}

module.exports = exports = ChannelSummary;

/**
 * 
 * @param id {Number}
 */
ChannelSummary.prototype.setId = function(id) {
    if('number' === typeof id)
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
ChannelSummary.prototype.setName = function(name) {
    if('string' === typeof name)
        this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
ChannelSummary.prototype.setLayer = function(layer) {
    if('object' === typeof layer && ('number' === typeof layer.id || '' === layer.id))
        this.layer = layer.id;
    else if('number' === typeof layer || '' === layer)
        this.layer = layer;
};
/**
 * 
 * @param namespace {String}
 */
ChannelSummary.prototype.setNamespace = function(namespace) {
    if('string' === typeof namespace)
        this.namespace = namespace;
};
/**
 * 
 * @param users {Object}
 */
ChannelSummary.prototype.setUsers = function(users) {
    if(Utilities.isObject(users))
        this.users = users;
};
ChannelSummary.prototype.appendUser = function(user) {
    if(Utilities.isObject(user) && Utilities.isString(user.socket))
        this.users[user.socket] = user;
};
ChannelSummary.prototype.removeUser = function(user) {
    if(Utilities.isObject(user) && Utilities.isString(user.socket))
        delete this.users[user.socket];
};
ChannelSummary.prototype.toChannel = function() {
    var Channel = require('./Channel');
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

