var Utilities = require('../util/Utilities');

/**
 * 请求数据对象
 * @param session {String}
 * @param action {String}
 * @param content {Object}
 */
function RequestData(session, action, content) {
    this.session = '';
    this.action = '';
    this.content = '';
    
    if(Utilities.isObject(session)) {
        var tmp = session;
        session = tmp.session;
        action = tmp.action;
        content = tmp.content;
    }
    
    this.setSession(session);
    this.setAction(action);
    this.setContent(content);
}

module.exports = exports = RequestData;
/**
 * 
 * @param session {String}
 */
RequestData.prototype.setSession = function(session) {
    if(Utilities.isObject(session) && Utilities.isString(session.session))
        this.session = session.session;
    else if(Utilities.isString(session))
        this.session = session;
};
/**
 * 
 * @param action {String}
 */
RequestData.prototype.setAction = function(action) {
    if(Utilities.isObject(action) && Utilities.isString(action.action))
        this.action = action.action;
    else if(Utilities.isString(action))
        this.action = action;
};
/**
 * 
 * @param content {Object}
 */
RequestData.prototype.setContent = function(content) {
    if(Utilities.isObject(content) || Utilities.isNumber(content) || Utilities.isString(content)
            || Utilities.isBoolean(content))
        this.content = content;
};