

module.exports = exports = Validater;

/**
 * 
 * @param data {Object}
 * @returns {Boolean}
 */
Validater.checkRequest = function(data) {
    if('object' !== typeof data) {
        return false;
    }
    if('undefined' === typeof data.session) {
        return false;
    }
    if('undefined' === typeof data.action) {
        return false;
    }
    if('undefined' === typeof data.content) {
        return false;
    }
    return true;
};
/**
 * 
 * @param data {Object}
 * @returns {Boolean}
 */
Validater.checkSend = function(data) {
    if('object' !== typeof data) {
        return false;
    }
    if('undefined' === typeof data.from) {
        return false;
    }
    if('undefined' === typeof data.to) {
        return false;
    }
    if('undefined' === typeof data.content) {
        return false;
    }
    return true;
};

function Validater() {
}
