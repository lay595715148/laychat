var Utilities = require('../util/Utilities');

/**
 * @param success
 *            {Boolean}
 * @param action
 *            {String}
 * @param content
 *            {Object}
 */
function ResponseData(success, action, content) {
    var _success = false, _action = '', _content = '';

    if(Utilities.isObject(success) && !Utilities.isNull(success)) {
        var tmp = success;
        success = tmp.success;
        action = tmp.action;
        content = tmp.content;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('success', function(success) {
        if(Utilities.isObject(success) && !Utilities.isNull(success) && Utilities.isBoolean(success.success))
            _success = success.success;
        else if(Utilities.isBoolean(success))
            _success = success;
    });
    this.__defineSetter__('action', function(action) {
        if(Utilities.isObject(action) && !Utilities.isNull(action) && Utilities.isString(action.action))
            _action = action.action;
        else if(Utilities.isString(action))
            _action = action;
    });
    this.__defineSetter__('content', function(content) {
        if(Utilities.isObject(content) && !Utilities.isNull(content) || Utilities.isNumber(content) || Utilities.isString(content)
                || Utilities.isBoolean(content))
            _content = content;
    });
    this.__defineGetter__('success', function() {
        return _success;
    });
    this.__defineGetter__('action', function() {
        return _action;
    });
    this.__defineGetter__('content', function() {
        return _content;
    });
    
    this.success = success;
    this.action = action;
    this.content = content;
}

module.exports = exports = ResponseData;

/**
 * 
 * @param success
 *            {Boolean}
 */
ResponseData.prototype.setSuccess = function(success) {
    this.success = success;
};
/**
 * 
 * @param action
 *            {String}
 */
ResponseData.prototype.setAction = function(action) {
    this.action = action;
};
/**
 * 
 * @param content
 *            {Object}
 */
ResponseData.prototype.setContent = function(content) {
    this.content = content;
};
/**
 * 
 */
ResponseData.prototype.getSuccess = function() {
    return this.success;
};
/**
 * 
 */
ResponseData.prototype.getAction = function() {
    return this.action;
};
/**
 * 
 */
ResponseData.prototype.getContent = function() {
    return this.content;
};
