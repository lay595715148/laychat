var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');
/**
 * 用户总述对象
 */
function UserSummary(id, name, nick, socket, channel, layer, status) {
    this.id = 0;//用户ID
    this.name = '';//用户名称
    this.nick = '';//用户昵称
    this.status = '';//当前状态
    
    if(Utilities.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        nick = tmp.nick;
        status = tmp.status || '';
    }
    
    this.setId(id);
    this.setName(name);
    this.setNick(nick);
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
    var User = require('../model/User');
    return new User(this);
};

/**
 * 
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 * @returns {Object}
 */
UserSummary.list = function(list, total, hasNext) {
    var uses = [];
    if(Utilities.isArray(list)) {
        list.forEach(function(item) {
            if(Utilities.isA(item, UserSummary)) {
                uses.push(item);
            }
        });
    }
    return Collector.list(uses, Utilities.isNumber(total)?total:uses.length, Utilities.isBoolean(hasNext)?hasNext:false);
};
