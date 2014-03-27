var Model = $.core.Model;

/**
 * 发送的信息
 */
function MessageSent(id, user, status, content, headers) {
    var _id = 0, _user = 0, _status = 0, _content = '', _headers = {};

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        user = tmp.user;
        status = tmp.status;
        content = tmp.content;
        headers = tmp.headers;
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
    this.__defineSetter__('status', function(status) {
        if($util.isNumber(status))
            _status = status;
    });
    this.__defineSetter__('content', function(content) {
        if($util.isString(content))
            _content = content;
    });
    this.__defineSetter__('headers', function(headers) {
        if($util.isObject(headers) && !$util.isNull(headers))
            _headers = headers;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('user', function() {
        return _user;
    });
    this.__defineGetter__('status', function() {
        return _status;
    });
    this.__defineGetter__('content', function() {
        return _content;
    });
    this.__defineGetter__('headers', function() {
        return _headers;
    });

    this.id = id;
    this.user = user;
    this.status = status;
    this.headers = headers;
    this.content = content;
}

$util.inherits(MessageSent, Model);

module.exports = exports = MessageSent;

MessageSent.prototype.setId = function(id) {
    this.id = id;
};
MessageSent.prototype.setUser = function(user) {
    this.user = user;
};
MessageSent.prototype.setStatus = function(status) {
    this.status = status;
};
MessageSent.prototype.setHeaders = function(headers) {
    this.headers = headers;
};
MessageSent.prototype.setContent = function(content) {
    this.content = content;
};
MessageSent.prototype.getId = function() {
    return this.id;
};
MessageSent.prototype.getUser = function() {
    return this.user;
};
MessageSent.prototype.getStatus = function() {
    return this.status;
};
MessageSent.prototype.getHeaders = function() {
    return this.headers;
};
MessageSent.prototype.getContent = function() {
    return this.content;
};
MessageSent.key = MessageSent.prototype.key = function() {
    return 'id';
}
