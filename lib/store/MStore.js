var Factory = $.util.Factory;
var Store = $.core.Store;

/**
 * @abstract
 */
function MStore(model, config) {
    this.model = model;
    Store.call(this, config);
}

module.exports = exports = MStore;

/**
 * @api private
 */
MStore.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {MStore}
 */
MStore.factory = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('store.');
    args.unshift(classname);
    args.unshift(MStore.instances);
    return Factory.factory.apply(null, args);
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {MStore}
 */
MStore.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('store.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};

/**
 * @abstract
 */
MStore.prototype.connect = function() {};
/**
 * @abstract
 */
MStore.prototype.close = function() {};
/**
 * @abstract
 */
MStore.prototype.insert = function() {};
/**
 * @abstract
 */
MStore.prototype.update = function() {};
/**
 * @abstract
 */
MStore.prototype.remove = function() {};
/**
 * @abstract
 */
MStore.prototype.select = function() {};
/**
 * @abstract
 */
MStore.prototype.count = function() {};
/**
 * @abstract
 */
MStore.prototype.choose = function() {};
/**
 * @abstract
 */
MStore.prototype.change = function() {};
