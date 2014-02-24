var User = require('../model/User');
var Model = require('../model/Model');

function UserGroup(id, name, users) {
    var _id = 0, _name = '', _users = {};

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        users = tmp.users;
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
    this.__defineSetter__('users', function(users) {
        if($util.isObject(users)) {
            var user, obj = {};
            for(var id in users) {
                user = users[id];
                if($util.isA(user, User)) {
                    obj[user.id] = user;
                } else {
                    throw new Error('All elements must be User instance');
                }
            }
            _users = obj;
        } else if($util.isArray(users)) {
            var obj = {};
            users.forEach(function(user) {
                if($util.isA(user, User)) {
                    obj[user.id] = user;
                } else {
                    throw new Error('All elements must be User instance');
                }
            });
            _users = obj;
        }
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('users', function() {
        return _users;
    });
    
    this.id = id;
    this.name = name;
    this.users = users;
}

$util.inherits(UserGroup, Model);

module.exports = exports = UserGroup;

/**
 * 
 * @param id {Number}
 */
UserGroup.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
UserGroup.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param name {String}
 */
UserGroup.prototype.setUsers = function(users) {
    this.users = users;
};

/**
 * 
 */
UserGroup.prototype.getId = function() {
    return this.id;
};
/**
 * 
 */
UserGroup.prototype.getName = function() {
    return this.name;
};
/**
 * 
 */
UserGroup.prototype.getUsers = function() {
    return this.users;
};
