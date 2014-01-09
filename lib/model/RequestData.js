
function RequestData() {
    this.session = '';
    this.action = '';
    this.content = {};
}

module.exports = exports = RequestData;
/**
 * 
 * @param session {String}
 */
RequestData.prototype.setSession = function(session) {
    if('string' === typeof session) {
        this.session = session;
    }
};
/**
 * 
 * @param action {String}
 */
RequestData.prototype.setAction = function(action) {
    if('string' === typeof action) {
        this.action = action;
    }
};
/**
 * 
 * @param content {Object}
 */
RequestData.prototype.setContent = function(content) {
    if('object' === typeof content) {
        this.content = content;
    }
};