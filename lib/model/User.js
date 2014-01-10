var UserSummary = require('./UserSummary');

/**
 * 用户对象
 * @param id {Number}
 * @param name {String}
 * @param nick {String}
 */
function User(id, name, nick) {
    this.id = 0;
    this.name = '';
    this.nick = '';
    
    if('object' === typeof id) {
        name = id.name;
        nick = id.nick;
        id = id.id;
    }
    
    this.setId(id);
    this.setName(name);
    this.setNick(nick);
}

module.exports = exports = User;

/**
 * 
 * @param id {Number}
 */
User.prototype.setId = function(id) {
    if('number' === typeof id)
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
User.prototype.setName = function(name) {
    if('string' === typeof name)
        this.name = name;
};
/**
 * 
 * @param nick {String}
 */
User.prototype.setNick = function(nick) {
    if('string' === typeof nick)
        this.nick = nick;
};
/**
 * 
 * @returns {UserSummary}
 */
User.prototype.toUserSummary = function() {
    return new UserSummary(this);
};
