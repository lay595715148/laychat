var Utilities = require('./Utilities');

module.exports = exports = Validater;

/**
 * 
 * @param data
 *            {Object}
 * @returns {Boolean}
 */
Validater.checkRequest = function(data) {
    if(!Utilities.isObject(data) || Utilities.isUndefined(data.session) || Utilities.isUndefined(data.action)
            || Utilities.isUndefined(data.content)) {
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
    if(!Utilities.isObject(data) || Utilities.isUndefined(data.from) || Utilities.isUndefined(data.to)
            || Utilities.isUndefined(data.content)) {
        return false;
    }
    return true;
};

function Validater() {
}
