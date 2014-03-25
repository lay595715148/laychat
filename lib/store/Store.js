var Factory = require('../util/Factory');

/**
 * 
 */
function Store(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;
}

module.exports = exports = Store;

/**
 * @api private
 */
Store.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Store}
 */
Store.factory = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('store.');
    args.unshift(classname);
    args.unshift(Store.instances);
    return Factory.factory.apply(null, args);
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Store}
 */
Store.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('store.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};

/**
 * @abstract
 */
Store.prototype.connect = function() {};
/**
 * @abstract
 */
Store.prototype.close = function() {};
/**
 * @abstract
 */
Store.prototype.insert = function() {};
/**
 * @abstract
 */
Store.prototype.update = function() {};
/**
 * @abstract
 */
Store.prototype.remove = function() {};
/**
 * @abstract
 */
Store.prototype.select = function() {};
/**
 * @abstract
 */
Store.prototype.count = function() {};
/**
 * @abstract
 */
Store.prototype.choose = function() {};
/**
 * @abstract
 */
Store.prototype.change = function() {};
