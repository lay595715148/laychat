var UserSummary = require('./UserSummary');

/**
 * 用户对象
 */
function User(id, name, nick) {
    if('object' === typeof id) {
        name = id.name;
        nick = id.nick;
        id = id.id;
    }
    if('undefined' === typeof id) {
        id = 0;
    }
    if('undefined' === typeof name) {
        name = '';
    }
    if('undefined' === typeof nick) {
        nick = '';
    }
    
    this.id = id;
    this.name = name;
    this.nick = nick;
    console.log('User construct');
}

User.prototype.setName = function(name) {
    this.name = name;
    console.log('console this');
    console.log(this);
};
User.prototype.toUserSummary = function() {
    var us = new UserSummary();
    us.setId(this.id);
    us.setName(this.name);
    us.setNick(this.nick);
    return us;
};

module.exports = User;
