var Factory = $.util.Factory;

/**
 *
 */
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
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('processer.');
    args.unshift(classname);
    args.unshift(Processer.instances);
    return Factory.factory.apply(null, args);
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Prefacer}
 */
Processer.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('processer.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};
