var Pool = $.core.Pool;

/**
 * @abstract
 */
function ModelPool(name, model) {
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

$util.inherits(ModelPool, Pool);

module.exports = exports = ModelPool;

/**
 * push an element in
 */
Pool.prototype.push = function(obj) {
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
Pool.prototype.unshift = function(obj) {
    if($util.isA(obj, this.model)) {
        this.objects.unshift(obj);
        this.maintain();
    }
    return this;
};
/**
 * maintain pool key-index
 */
Pool.prototype.maintain = function() {
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
Pool.prototype.shift = function() {
    var id = this.model.key();
    var obj = this.objects.shift();
    delete this.indexes[obj[id]];
    this.maintain();
    return obj;
};
/**
 * pop last element
 */
Pool.prototype.pop = function(key) {
    var id = this.model.key();
    var obj = this.objects.pop();
    delete this.indexes[obj[id]];
    return obj;
};
/**
 * @api private
 * @returns
 */
ModelPool.prototype._primary = function() {
    return this.model.key();
};
ModelPool.prototype.push = function(instance) {
    var id = this._primary();
    var len = this.objects.push(instance);
    this.indexes[instance[id]] = len - 1;
};
ModelPool.prototype.pop = function(key) {
    var id = this._primary();
    var instance = this.objects.pop();
    delete this.indexes[instance[id]];
    return instance;
};
