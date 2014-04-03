var Pool = $.core.Pool;

/**
 * @abstract
 */
function ModelPool(name, storage, model) {
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
    
    Pool.call(this, name, storage);
}

$util.inherits(ModelPool, Pool);

module.exports = exports = ModelPool;
