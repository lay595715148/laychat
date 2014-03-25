var Factory = require('../util/Factory');

/**
 * 
 */
function Pool(name) {
    var _name = '', _objects = [], _indexes = {};

    // 一些setter和getter方法
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineSetter__('objects', function(objects) {
        if($util.isArray(objects))
            _objects = objects;
    });
    this.__defineSetter__('indexes', function(indexes) {
        if($util.isObject(indexes))
            _indexes = indexes;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('objects', function() {
        return _objects;
    });
    this.__defineGetter__('indexes', function() {
        return _indexes;
    });

    this.name = name;
    this.objects = [];
    this.indexes = {};
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
 * push an element in
 */
Pool.prototype.push = function(obj, key) {
    var id = $util.isString(key) ? key : 'id';
    var len = this.objects.push(obj);
    this.indexes[obj[id]] = len - 1;
    return this;
};
/**
 * maintain pool key-index
 */
Pool.prototype.maintain = function(key) {
    var id = $util.isString(key) ? key : 'id';
    var me = this;
    
    this.indexes = {};
    this.objects.map(function(obj, index) {
        me.indexes[obj[id]] = index;
    });
};
/**
 * shift first element
 */
Pool.prototype.shift = function(key) {
    var id = $util.isString(key) ? key : 'id';
    var obj = this.objects.shift();
    delete this.indexes[obj[id]];
    this.maintain(key);
    return obj;
};
/**
 * pop last element
 */
Pool.prototype.pop = function(key) {
    var id = $util.isString(key) ? key : 'id';
    var obj = this.objects.pop();
    delete this.indexes[obj[id]];
    return obj;
};
/**
 * get by first index
 */
Pool.prototype.first = function() {
    return this.index(0);
};
/**
 * get by last index
 */
Pool.prototype.last = function() {
    var len = this.objects.length;
    return this.index(len - 1);
};
/**
 * get by index
 */
Pool.prototype.index = function(num) {
    if($util.isDefined(this.objects[num]) && !$util.isNull(this.objects[num])) {
        return this.objects[num];
    } else {
        return false;
    }
};
/**
 * get by key
 */
Pool.prototype.get = function(pri) {
    var num = this.indexes[pri];
    if($util.isNumber(num)) {
        return this.index(num);
    } else {
        return false;
    }
};
/**
 * get series by key array
 */
Pool.prototype.gets = function(pris) {
    var instances = [], num, me = this;
    pris.map(function(pri) {
        num = me.indexes[pri];
        if($util.isNumber(num)) {
            instances.push(me.index(num));
        }
    });
    return instances;
};

/**
 * @abstract
 */
Pool.prototype.load = function(fn) {};
/**
 * @abstract
 */
Pool.prototype.save = function(fn) {};
