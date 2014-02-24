/**
 * 
 */
function Validater() {
}

module.exports = exports = Validater;

/**
 * 
 * @param data
 *            {Object}
 * @returns {Boolean}
 */
Validater.checkRequest = function(data) {
    if(!$util.isObject(data) || $util.isUndefined(data.session) || $util.isUndefined(data.action)
            || $util.isUndefined(data.content)) {
        return false;
    }
    return true;
};
/**
 * 
 * @param data
 *            {Object}
 * @returns {Boolean}
 */
Validater.checkRequestSend = function(data) {
    if(!$util.isObject(data) || $util.isUndefined(data.headers) || $util.isUndefined(data.content)) {
        return false;
    }
    return true;
};
