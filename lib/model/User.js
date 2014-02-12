var Utilities = require('../util/Utilities');
var UserSummary = require('../data/UserSummary');

/**
 * 用户对象
 * @param id {Number}
 * @param name {String}
 * @param nick {String}
 */
function User(id, name, pass, nick) {
    this.id = 0;
    this.name = '';
    this.pass = '';
    this.nick = '';
    
    if('object' === typeof id) {
        id = id.id;
        name = id.name;
        pass = id.pass;
        nick = id.nick;
    }
    
    this.setId(id);
    this.setName(name);
    this.setPass(pass);
    this.setNick(nick);
}

module.exports = exports = User;

/**
 * 
 * @param id {Number}
 */
User.prototype.setId = function(id) {
    if(Utilities.isNumber(id))
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
User.prototype.setName = function(name) {
    if(Utilities.isString(name))
        this.name = name;
};
/**
 * 
 * @param name {String}
 */
User.prototype.setPass = function(pass) {
    if(Utilities.isString(pass))
        this.pass = pass;
};
/**
 * 
 * @param nick {String}
 */
User.prototype.setNick = function(nick) {
    if(Utilities.isString(nick))
        this.nick = nick;
};
/**
 * 
 * @returns {UserSummary}
 */
User.prototype.toUserSummary = function() {
    return new UserSummary(this);
};
