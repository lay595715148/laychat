var User = require('./User');
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

/**
 * 通过令牌码生成用户对象
 * @param token string
 * @returns {User}
 */
UserSummary.generateByToken = function(token) {
    // TODO
    var us = new UserSummary();
    us.setId(Math.floor(Math.random() * 100000));
    us.setName('lay');
    us.setNick('admin');
    return us;
};

module.exports = UserSummary;