var Utilities = require('../util/Utilities');

function Prefacer(req, res) {
    this.req = req;
    this.res = res;
}

module.exports = exports = Prefacer;

/**
 * @api private
 */
Prefacer.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Prefacer}
 */
Prefacer.factory = function(classname) {
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if(Utilities.isA(Prefacer.instances[classname], Prefacer)) {
        instance = Prefacer.instances[classname];
    } else {
        var SubClass = require('../prefacer/' + classname);
        instance = Prefacer.instances[classname] = Utilities.construct(SubClass, args);
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Prefacer}
 */
Prefacer.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    var SubClass = require('../prefacer/' + classname);
    return Utilities.construct(SubClass, args);
};

Prefacer.prototype.run = function(fn) {
    Utilities.isFunction(fn) && fn();
};

