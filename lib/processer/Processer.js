var Utilities = require('../util/Utilities');

function Processer() {
}

module.exports = exports = Processer;

/**
 * @api private
 */
Processer.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Processer}
 */
Processer.factory = function(classname) {
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if(Utilities.isA(Processer.instances[classname], Processer)) {
        instance = Prefacer.instances[classname];
    } else {
        var SubClass = require('../processer/' + classname);
        instance = Processer.instances[classname] = Utilities.construct(SubClass, args);
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Prefacer}
 */
Processer.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    var SubClass = require('../processer/' + classname);
    return Utilities.construct(SubClass, args);
};
