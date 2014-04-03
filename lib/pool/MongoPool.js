var Mongo = $.store.Mongo;
var ModelPool = $.pool.ModelPool;

/**
 * @abstract
 */
function MongoPool(name, model, store) {
    var _store = {};

    this.__defineSetter__('store', function(store) {
        if($util.isA(store, Mongo))
            _store = store;
    });
    this.__defineGetter__('store', function(store) {
        return _store;
    });

    this.store = store;

    ModelPool.call(this, name, model);
}

$util.inherits(MongoPool, ModelPool);

module.exports = exports = MongoPool;

/**
 * @implement
 */
MongoPool.prototype.load = function(fn) {
    var me = this;
    var name = this.name;
    this.store.gets(name, function(result) {
        var objects = result;
        objects.map(function(item) {
            me.push(item);
        });
        $util.isFunction(fn) && fn(objects);
    });
};
/**
 * @implement
 */
MongoPool.prototype.save = function(lifetime, fn) {
    var name = this.name;
    var objects = this.objects;
    this.store.sets(name, objects, lifetime, function(result) {
        $util.isFunction(fn) && fn(result);
    });
};
/**
 * @implement
 */
MongoPool.prototype.openAutoClean = function(fn) {
    
};
