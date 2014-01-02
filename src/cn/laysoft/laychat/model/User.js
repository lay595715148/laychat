

/**
 * 用户对象
 */
function User(id, name, nick, socket) {
    if('object' === typeof id) {
        name = id.name;
        nick = id.nick;
        id = id.id;
        socket = id.socket;
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
    if('undefined' === typeof socket) {
        socket = null;
    }
    
    this.id = id;
    this.name = name;
    this.nick = nick;
    this.socket = socket;
    console.log('User construct');
}

User.prototype.setName = function(name) {
    this.name = name;
    console.log('console this');
    console.log(this);
};
User.prototype.setSocket = function(socket) {
    if('object' === typeof socket)
        this.socket = socket.id;
    else 
        this.socket = socket;
};
/**
 * 通过令牌码生成用户对象
 * @param token string
 * @returns {User}
 */
User.generateByToken = function(token) {
    // TODO
    return new User(1, 'lay', 'admin');
};

module.exports = User;
