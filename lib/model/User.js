var Utilities = require('../util/Utilities');
var UserSummary = require('../data/UserSummary');
var UserSocketSummary = require('../data/UserSocketSummary');
var Model = require('../model/Model');

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
    
    if(Utilities.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        pass = tmp.pass;
        nick = tmp.nick;
    }
    
    this.setId(id);
    this.setName(name);
    this.setPass(pass);
    this.setNick(nick);
}

Utilities.inherits(User, Model);

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
User.prototype.toUserSocketSummary = function() {
    return new UserSocketSummary(this);
};

User.table = User.prototype.table = function() {
    return 'lay_users';
};
User.columns = User.prototype.columns = function() {
    return {
        'id':'id',
        'name':'name',
        'pass':'pass',
        'nick':'nick'
    };
};

