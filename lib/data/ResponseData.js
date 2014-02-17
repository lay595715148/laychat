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
    this.success = false;
    this.action = '';
    this.content = '';

    if(Utilities.isObject(success)) {
        var tmp = success;
        success = tmp.success;
        action = tmp.action;
        content = tmp.content;
    }

    this.setSuccess(success);
    this.setAction(action);
    this.setContent(content);
}

module.exports = exports = ResponseData;
/**
 * 
 * @param success
 *            {Boolean}
 */
ResponseData.prototype.setSuccess = function(success) {
    if(Utilities.isObject(success) && Utilities.isBoolean(success.success))
        this.success = success.success;
    else if(Utilities.isBoolean(success))
        this.success = success;
};
/**
 * 
 * @param action
 *            {String}
 */
ResponseData.prototype.setAction = function(action) {
    if(Utilities.isObject(action) && Utilities.isString(action.action))
        this.action = action.action;
    else if(Utilities.isString(action))
        this.action = action;
};
/**
 * 
 * @param content
 *            {Object}
 */
ResponseData.prototype.setContent = function(content) {
    if(Utilities.isObject(content) || Utilities.isNumber(content) || Utilities.isString(content)
            || Utilities.isBoolean(content))
        this.content = content;
};
