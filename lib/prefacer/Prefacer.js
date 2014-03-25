var Scope = require('../util/Scope');
var Factory = require('../util/Factory');

/**
 * 
 */
function Prefacer(action) {
    this.action = action;
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
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('prefacer.');
    args.unshift(classname);
    args.unshift(Prefacer.instances);
    return Factory.factory.apply(null, args);
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Prefacer}
 */
Prefacer.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('prefacer.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};

Prefacer.prototype.run = function(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    $util.isFunction(fn) && fn.apply(fn, args);
};

