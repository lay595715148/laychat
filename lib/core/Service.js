var Factory = $.util.Factory;

/**
 * 
 */
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
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('service.');
    args.unshift(classname);
    args.unshift(Service.instances);
    return Factory.factory.apply(null, args);
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Service}
 */
Service.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('service.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};
