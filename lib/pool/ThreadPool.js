var Pool = $.core.Pool;

/**
 * @abstract
 */
function ThreadPool(name, model) {
    var _model = null;

    this.__defineSetter__('model', function(model) {
        if($util.isFunction(model))
            _model = model;
        else if($util.isString(model) && model.indexOf('model') === 0)
            _model = $require(model);
        else if($util.isString(model))
            _model = $require('model.' + model);
    });
    this.__defineGetter__('model', function() {
        return _model;
    });
    
    this.model = model;
    
    Pool.call(this, name);
}

$util.inherits(ThreadPool, Pool);

module.exports = exports = ThreadPool;

/**
 * push an element in
 */
ThreadPool.prototype.push = function(obj) {
    if($util.isA(obj, this.model)) {
        var id = this.model.key();
        var len = this.objects.push(obj);
        this.indexes[obj[id]] = len - 1;
    }
    return this;
};
/**
 * shift first element
 */
ThreadPool.prototype.unshift = function(obj) {
    if($util.isA(obj, this.model)) {
        this.objects.unshift(obj);
        this.maintain();
    }
    return this;
};
/**
 * maintain pool key-index
 */
ThreadPool.prototype.maintain = function() {
    var id = this.model.key();
    var me = this;
    
    this.indexes = {};
    this.objects.map(function(obj, index) {
        me.indexes[obj[id]] = index;
    });
};
/**
 * shift first element
 */
ThreadPool.prototype.shift = function() {
    var id = this.model.key();
    var obj = this.objects.shift();
    delete this.indexes[obj[id]];
    this.maintain();
    return obj;
};
/**
 * pop last element
 */
ThreadPool.prototype.pop = function(key) {
    var id = this.model.key();
    var obj = this.objects.pop();
    delete this.indexes[obj[id]];
    return obj;
};
