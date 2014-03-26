var Entity = $require('core.Entity');
var Collector = $require('util.Collector');

/**
 * 
 */
function SocketMessage(id, user, content, headers) {
    var _id = 0, _user = {}, _content = '', _headers = {};

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        user = tmp.user;
        content = tmp.content;
        headers = tmp.headers;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('user', function(user) {
        if($util.isObject(user) && !$util.isNull(user))
            _user = user;
    });
    this.__defineSetter__('content', function(content) {
        if($util.isString(content))
            _content = content;
    });
    this.__defineSetter__('headers', function(headers) {
        if($util.isObject(headers) && !$util.isNull(headers))
            _headers = headers;
    });
    this.__defineGetter__('user', function() {
        return _user;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('content', function() {
        return _content;
    });
    this.__defineGetter__('headers', function() {
        return _headers;
    });

    this.id = id;
    this.user = user;
    this.headers = headers;
    this.content = content;
}

$util.inherits(SocketMessage, Entity);

module.exports = exports = SocketMessage;

SocketMessage.prototype.setId = function(id) {
    this.id = id;
};
SocketMessage.prototype.setUser = function(user) {
    this.user = user;
};
SocketMessage.prototype.setHeaders = function(headers) {
    this.headers = headers;
};
SocketMessage.prototype.setContent = function(content) {
    this.content = content;
};
SocketMessage.prototype.getId = function() {
    return this.id;
};
SocketMessage.prototype.getUser = function() {
    return this.user;
};
SocketMessage.prototype.getHeaders = function() {
    return this.headers;
};
SocketMessage.prototype.getContent = function() {
    return this.content;
};

/**
 * 主键属性名
 * @abstract
 */
SocketMessage.key = SocketMessage.prototype.key = function() {
    return 'id';
};
