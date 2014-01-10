
/**
 * 请求数据对象
 * @param session {String}
 * @param action {String}
 * @param content {Object}
 */
function RequestData(session, action, content) {
    this.session = '';
    this.action = '';
    this.content = {};
    
    if('object' === typeof session) {
        session = session.session;
        action = session.action;
        content = session.content;
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
    if('object' === typeof session && 'string' === typeof session.session)
        this.session = session.session;
    else if('string' === typeof session)
        this.session = session;
};
/**
 * 
 * @param action {String}
 */
RequestData.prototype.setAction = function(action) {
    if('object' === typeof action && 'string' === typeof action.action)
        this.action = action.action;
    else if('string' === typeof action)
        this.action = action;
};
/**
 * 
 * @param content {Object}
 */
RequestData.prototype.setContent = function(content) {
    if('object' === typeof content || 'number' === typeof content || 'string' === typeof content || 'boolean' === typeof content)
        this.content = content;
};