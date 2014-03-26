var Pool = $require('core.Pool');

/**
 * @abstract
 */
function EntityPool(name, entity) {
    var _entity = {};

    this.__defineSetter__('entity', function(entity) {
        if($util.isFunction(entity))
            _entity = entity;
        else if($util.isString(entity) && entity.indexOf('entity.') === 0)
            _entity = $require(entity);
        else if($util.isString(entity))
            _entity = $require('entity.' + entity);
    });
    this.__defineGetter__('entity', function() {
        return _entity;
    });
    
    this.entity = entity;
    
    Pool.call(this, name);
}

$util.inherits(EntityPool, Pool);

module.exports = exports = EntityPool;

/**
 * @api private
 * @returns
 */
EntityPool.prototype._primary = function() {
    return this.entity.key();
};
EntityPool.prototype.push = function(obj) {
    var id = this._primary();
    var len = this.objects.push(obj);
    this.indexes[obj[id]] = len - 1;
};
EntityPool.prototype.pop = function() {
    var id = this._primary();
    var obj = this.objects.pop();
    delete this.indexes[obj[id]];
    return obj;
};
