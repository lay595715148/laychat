var Model = $.core.Model;
var MessageSent = $.model.MessageSent;
var MessageReceived = $.model.MessageReceived;
var SocketMessage = $.entity.SocketMessage;

/**
 * 后续还需要根据rfc2822进行修改
 */
function Message(id, content, headers) {
    var _id = 0, _content = '', _headers = {};

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        content = tmp.content;
        headers = tmp.headers;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
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
    this.__defineGetter__('content', function() {
        return _content;
    });
    this.__defineGetter__('headers', function() {
        return _headers;
    });

    this.id = id;
    this.headers = headers;
    this.content = content;
}

$util.inherits(Message, Model);

module.exports = exports = Message;

Message.prototype.setId = function(id) {
    this.id = id;
};
Message.prototype.setHeaders = function(headers) {
    this.headers = headers;
};
Message.prototype.setContent = function(content) {
    this.content = content;
};
Message.prototype.getId = function() {
    return this.id;
};
Message.prototype.getHeaders = function() {
    return this.headers;
};
Message.prototype.getContent = function() {
    return this.content;
};

Message.prototype.toSent = function() {
};
Message.prototype.toReceiveds = function() {
};

Message.table = Message.prototype.table = function() {
    return 'lay_message';
};
Message.columns = Message.prototype.columns = function() {
    return {
        'id':'_id',
        'headers':'headers',
        'content':'content'
    };
};
Message.primary = Message.prototype.primary = function() {
    return '_id';
};
Message.sequence = Message.prototype.sequence = function() {
    return '_id';
};
Message.key = Message.prototype.key = function() {
    return 'id';
}
