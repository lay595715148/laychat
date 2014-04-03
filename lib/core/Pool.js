var Factory = $.util.Factory;

/**
 * @abstract
 */
function Pool(name, storage) {
    var _name = '', _storage = {};

    // 一些setter和getter方法
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineSetter__('storage', function(storage) {
        if($util.isObject(storage))
            _storage = storage;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('storage', function() {
        return _storage;
    });

    this.name = name;
    this.storage = storage;
}

module.exports = exports = Pool;

/**
 * @api private
 */
Pool.instances = {};
/**
 * @api public
 * @param {String} classname
 * @param {String} name
 * @returns {Store}
 */
Pool.factory = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('pool.');
    args.unshift(classname);
    args.unshift(Pool.instances);
    return Factory.factory.apply(null, args);
};

/**
 * @protected
 * @returns
 */
Pool.prototype.key = function() {
    return 'id';
};
/**
 * set an element in
 * @abstract
 */
Pool.prototype.set = function(obj, fn) {};
/**
 * set series elements in
 * @abstract
 */
Pool.prototype.sets = function(objs, fn) {};
/**
 * get by key
 * @abstract
 */
Pool.prototype.get = function(pri, fn) {};
/**
 * get series by key array
 * @abstract
 */
Pool.prototype.gets = function(pris, fn) {};
/**
 * delete by key
 * @abstract
 */
Pool.prototype.del = function(pri, fn) {};
/**
 * delete series by key array
 * @abstract
 */
Pool.prototype.dels = function(pris, fn) {};
/**
 * @abstract
 */
Pool.prototype.reset = function(fn) {};
