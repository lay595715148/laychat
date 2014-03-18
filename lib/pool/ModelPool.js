var Pool = $require('pool.Pool');

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
 * @api private
 * @returns
 */
ModelPool.prototype._primary = function() {
    var pri = this.model.primary();
    var columns = this.model.columns();
    var pros = $_.invert(columns);
    var key = pros[pri];
    return key;
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
