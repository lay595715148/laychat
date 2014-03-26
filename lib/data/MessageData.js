/**
 * 后续还需要根据rfc2822进行修改
 */
function MessageData(content, headers) {
    var _content = '', _headers = {};

    if($util.isObject(content) && !$util.isNull(content)) {
        var tmp = content;
        content = tmp.content;
        headers = tmp.headers;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('content', function(content) {
        if($util.isString(content))
            _content = content;
    });
    this.__defineSetter__('headers', function(headers) {
        if($util.isObject(headers) && !$util.isNull(headers))
            _headers = headers;
    });
    this.__defineGetter__('content', function() {
        return _content;
    });
    this.__defineGetter__('headers', function() {
        return _headers;
    });

    this.headers = headers;
    this.content = content;
}

module.exports = exports = MessageData;

MessageData.prototype.setHeaders = function(headers) {
    this.headers = headers;
};
MessageData.prototype.setContent = function(content) {
    this.content = content;
};
MessageData.prototype.getHeaders = function() {
    return this.headers;
};
MessageData.prototype.getContent = function() {
    return this.content;
};
