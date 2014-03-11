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
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isA(Store.instances[classname], Store)) {
        instance = Store.instances[classname];
    } else {
        if($util.isFunction(classname)) {
            SubClass = classname;
        } else {
            if(classname.indexOf('store') === 0) {
                SubClass = $require(classname);
            } else {
                SubClass = $require('store.' + classname);
            }
        }
        if($util.isFunction(SubClass)) {
            instance = Store.instances[classname] = $util.construct(SubClass, args);
        }
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Store}
 */
Store.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('store') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('store.' + classname);
        }
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
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
