var Model = require('../model/Model');

/**
 * 后续还需要根据rfc2822进行修改
 */
function MessageHistory(id, content, headers) {
    var _id = 0, _content = '', _headers = {};

    if(Utilities.isObject(id) && Utilities.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        content = tmp.content;
        headers = tmp.headers;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if(Utilities.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('content', function(content) {
        if(Utilities.isString(content))
            _content = content;
    });
    this.__defineSetter__('headers', function(headers) {
        if(Utilities.isObject(headers) && !Utilities.isNull(headers))
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

Utilities.inherits(MessageHistory, Model);

module.exports = exports = MessageHistory;

MessageHistory.prototype.setId = function(id) {
    this.id = id;
};
MessageHistory.prototype.setHeaders = function(headers) {
    this.headers = headers;
};
MessageHistory.prototype.setContent = function(content) {
    this.content = content;
};
MessageHistory.prototype.getId = function() {
    return this.id;
};
MessageHistory.prototype.getHeaders = function() {
    return this.headers;
};
MessageHistory.prototype.getContent = function() {
    return this.content;
};
