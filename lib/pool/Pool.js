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
    
    this.load();
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
Pool.factory = function(classname, name) {
    var SubClass;
    var instance = null;
    var args = [].slice.call(arguments, 1);
    if($util.isA(Pool.instances[classname], Pool)) {
        instance = Pool.instances[classname];
    } else {
        if(classname.indexOf('pool') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('pool.' + classname);
        }
        instance = Pool.instances[classname] = $util.construct(SubClass, args);
    }
    return instance;
};

Pool.prototype.push = function(instance, key) {
    var id = $util.isString(key) ? key : 'id';
    var len = this.objects.push(instance);$logger.error('len', len, this.objects);
    this.indexes[instance[id]] = len - 1;
    return this;
};
Pool.prototype.pop = function(key) {
    var id = $util.isString(key) ? key : 'id';
    var instance = this.objects.pop();
    delete this.indexes[instance[id]];
    return instance;
};
Pool.prototype.first = function() {
    return this.index(0);
};
Pool.prototype.last = function() {
    var len = this.objects.length;
    return this.index(len - 1);
};
Pool.prototype.index = function(num) {
    var instance = this.objects[num];
    return instance;
};
Pool.prototype.get = function(pri) {
    var num = this.indexes[pri];
    var instance = this.objects[num];
    return instance;
};
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
