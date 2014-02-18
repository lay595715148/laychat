var Utilities = require('../util/Utilities');

function Service(store) {
    this.store = store;
}

module.exports = exports = Service;

/**
 * @api private
 */
Service.instances = {};
/**
 * 
 * 
 * @api public
 * @param {String} classname
 * @returns {Service}
 */
Service.factory = function(classname) {
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if(Utilities.isA(Service.instances[classname], Service)) {
        instance = Service.instances[classname];
    } else {
        var SubClass = require('../service/' + classname);
        instance = Service.instances[classname] = Utilities.construct(SubClass, args);
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Service}
 */
Service.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    var SubClass = require('../service/' + classname);
    return Utilities.construct(SubClass, args);
};
