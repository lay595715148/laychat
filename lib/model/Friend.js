var Model = $.core.Model;

/**
 * 用户好友对象
 * @param id {Number}
 * @param friend {Number}
 * @param extension {String}
 */
function Friend(id, user, friend, extension) {
    var _id = 0, _user = 0, _friend = 0, _extension = '';
    
    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        user = tmp.user;
        friend = tmp.friend;
        extension = tmp.extension;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('user', function(user) {
        if($util.isNumber(user))
            _user = user;
    });
    this.__defineSetter__('friend', function(friend) {
        if($util.isNumber(friend))
            _friend = friend;
    });
    this.__defineSetter__('extension', function(extension) {
        if($util.isString(extension))
            _extension = extension;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('user', function() {
        return _user;
    });
    this.__defineGetter__('friend', function() {
        return _friend;
    });
    this.__defineGetter__('extension', function() {
        return _extension;
    });
    
    this.id = id;
    this.user = user;
    this.friend = friend;
    this.extension = extension;
}

$util.inherits(Friend, Model);

module.exports = exports = Friend;

/**
 * 
 * @param id {Number}
 */
Friend.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param user {Number}
 */
Friend.prototype.setUser = function(user) {
    this.user = user;
};
/**
 * 
 * @param friend {Number}
 */
Friend.prototype.setFriend = function(friend) {
    this.friend = friend;
};
/**
 * 
 * @param extension {String}
 */
Friend.prototype.setExt = function(extension) {
    this.extension = extension;
};
/**
 * 
 * @param id {Number}
 */
Friend.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @param user {Number}
 */
Friend.prototype.getUser = function() {
    return this.user;
};
/**
 * 
 * @param friend {Number}
 */
Friend.prototype.getFriend = function() {
    return this.friend;
};
/**
 * 
 * @param friend {Number}
 */
Friend.prototype.getExt = function() {
    return this.extension;
};

Friend.table = Friend.prototype.table = function() {
    return 'lay_friend';
};
Friend.columns = Friend.prototype.columns = function() {
    return {
        'id':'_id',
        'user':'userid',
        'friend':'friendid',
        'extension':'extension'
    };
};
Friend.primary = Friend.prototype.primary = function() {
    return '_id';
};
Friend.sequence = Friend.prototype.sequence = function() {
    return '_id';
};
Friend.key = Friend.prototype.key = function() {
    return 'id';
}
