var Utilities = require('../util/Utilities');

function Manager(io) {
    this.io = io;
}

module.exports = exports = Manager;

Manager.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Manager}
 */
Manager.factory = function(classname) {
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if(Utilities.isA(Manager.instances[classname], Manager)) {
        instance = Manager.instances[classname];
    } else {
        var SubClass = require('../manager/' + classname);
        instance = Manager.instances[classname] = Utilities.construct(SubClass, args);
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Action}
 */
Manager.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    var SubClass = require('../manager/' + classname);
    return Utilities.construct(SubClass, args);
};
