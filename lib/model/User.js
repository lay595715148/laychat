var UserSummary = require('../data/UserSummary');
var SocketUser = require('../entity/SocketUser');
var SocketUserSummary = require('../data/SocketUserSummary');
var Model = require('../model/Model');

/**
 * 用户对象
 * @param id {Number}
 * @param name {String}
 * @param nick {String}
 */
function User(id, name, pass, nick) {
    var _id = 0, _name = '', _pass = '', _nick = '';
    
    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        pass = tmp.pass;
        nick = tmp.nick;
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
    this.__defineSetter__('pass', function(pass) {
        if($util.isString(pass))
            _pass = pass;
    });
    this.__defineSetter__('nick', function(nick) {
        if($util.isString(nick))
            _nick = nick;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('pass', function() {
        return _pass;
    });
    this.__defineGetter__('nick', function() {
        return _nick;
    });
    
    this.id = id;
    this.name = name;
    this.pass = pass;
    this.nick = nick;
}

$util.inherits(User, Model);

module.exports = exports = User;

/**
 * 
 * @param id {Number}
 */
User.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
User.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param name {String}
 */
User.prototype.setPass = function(pass) {
    this.pass = pass;
};
/**
 * 
 * @param nick {String}
 */
User.prototype.setNick = function(nick) {
    this.nick = nick;
};
/**
 * 
 * @param id {Number}
 */
User.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @param name {String}
 */
User.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @param name {String}
 */
User.prototype.getPass = function() {
    return this.pass;
};
/**
 * 
 * @param nick {String}
 */
User.prototype.getNick = function() {
    return this.nick;
};
/**
 * 
 * @returns {UserSummary}
 */
User.prototype.toUserSummary = function() {
    return new UserSummary(this);
};
/**
 * 
 * @returns {SocketUser}
 */
User.prototype.toSocketUser = function() {
    return new SocketUser(this);
};
User.prototype.toSocketUserSummary = function() {
    return new SocketUserSummary(this);
};

User.table = User.prototype.table = function() {
    return 'lay_user';
};
User.columns = User.prototype.columns = function() {
    return {
        'id':'_id',
        'name':'name',
        'pass':'pass',
        'nick':'nick'
    };
};
User.primary = User.prototype.primary = function() {
    return '_id';
};
User.sequence = User.prototype.sequence = function() {
    return '_id';
};
