var Collector = require('../util/Collector');
var Data = require('../data/Data');

/**
 * 用户总述对象
 */
function UserSummary(id, name, nick, status) {
    var _id = 0, _name = '', _nick = '', _status = '';

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        nick = tmp.nick;
        status = tmp.status;
    }

    // 一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineSetter__('nick', function(nick) {
        if($util.isString(nick))
            _nick = nick;
    });
    this.__defineSetter__('status', function(status) {
        if($util.isNumber(status) || $util.isString(status))
            _status = status;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('nick', function() {
        return _nick;
    });
    this.__defineGetter__('status', function() {
        return _status;
    });

    this.id = id;// 用户ID
    this.name = name;// 用户名称
    this.nick = nick;// 用户昵称
    this.status = status;// 当前状态
}

$util.inherits(UserSummary, Data);

module.exports = exports = UserSummary;

/**
 * 
 * @param id
 *            {Number}
 */
UserSummary.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name
 *            {String}
 */
UserSummary.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param nick
 *            {String}
 */
UserSummary.prototype.setNick = function(nick) {
    this.nick = nick;
};
/**
 * user current status
 * 
 * @param status
 *            {String}
 */
UserSummary.prototype.setStatus = function(status) {
    this.status = status;
};
/**
 * 
 * @returns {Number}
 */
UserSummary.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @returns {String}
 */
UserSummary.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @returns {String}
 */
UserSummary.prototype.getNick = function() {
    return this.nick;
};
/**
 * @returns {String}
 */
UserSummary.prototype.getStatus = function() {
    return this.status;
};
/**
 * ]
 * 
 * @returns {User}
 */
UserSummary.prototype.toUser = function() {
    var User = require('../model/User');
    return new User(this);
};

/**
 * 
 * @param list
 *            {Array}
 * @param total
 *            {Number}
 * @param hasNext
 *            {Boolean}
 * @returns {Object}
 */
UserSummary.list = function(list, total, hasNext) {
    var uses = [];
    if($util.isArray(list)) {
        list.forEach(function(item) {
            if($util.isA(item, UserSummary)) {
                uses.push(item);
            }
        });
    }
    return Collector
            .list(uses, $util.isNumber(total) ? total : uses.length, $util.isBoolean(hasNext) ? hasNext : false);
};
