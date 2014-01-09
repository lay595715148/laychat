
function ResponseData() {
    this.success = false;
    this.action = '';
    this.content = {};
}

module.exports = exports = ResponseData;
/**
 * 
 * @param success {Boolean|Object}
 */
ResponseData.prototype.setSuccess = function(success) {
    if('object' === typeof success && 'boolean' === typeof success.success) {
        this.success = success.success;
    } else if('boolean' === typeof success) {
        this.success = success;
    }
};
/**
 * 
 * @param action {String|Object}
 */
ResponseData.prototype.setAction = function(action) {
    if('object' === typeof action && 'string' === typeof action.action) {
        this.action = action.action;
    } else if('string' === typeof action) {
        this.action = action;
    }
};
/**
 * 
 * @param content {Object}
 */
ResponseData.prototype.setContent = function(content) {
    if('object' === typeof content) {
        this.content = content;
    }
};
/**
 * 
 * @returns {Object}
 */
ResponseData.prototype.toJson = function() {
    return {'success':this.success, 'action':this.action, 'content':this.content};
};