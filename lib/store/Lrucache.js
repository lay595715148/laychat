var assert = require('assert');
var lrucache = require('lru-cache');
var Store = $.core.Store;

function Lrucache(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;

    this.init();
}

$util.inherits(Lrucache, Store);

module.exports = exports = Lrucache;

/**
 * @api private
 */
Lrucache.prototype.init = function() {
    var config = this.config;
    this.link = new lrucache(config);
    // always connect lazily
};
/**
 * 不可更改
 * 
 * @sync
 */
Lrucache.prototype.change = function(config, fn) {
    fn = Array.prototype.slice.call(arguments, 0).pop();
    $util.isFunction(fn) && fn(false);
    return false;
};
/**
 * 
 * 不可关闭
 * @param fn
 */
Lrucache.prototype.close = function(fn) {
    $util.isFunction(fn) && fn(false);
    return false;
};
/**
 * @api private
 */
Lrucache.prototype.connect = function(fn) {
    var link = this.link;
    if(!$util.isEmpty(this.link.conn)) {
        $util.isFunction(fn) && fn();
    } else {
    }
};
/**
 * 
 * @param database
 * @param fn
 */
Lrucache.prototype.set = function(key, obj, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var docs = {};
    var value = '';

    if($util.isFunction(lifetime)) {
        fn = lifetime;
        lifetime = 1800;
    }

    if($util.isA(obj, me.model)) {
        Object.keys(columns).map(function(pro) {
            var field = columns[pro];
            docs[field] = obj[pro];
        });
    }
};
/**
 * 
 * @param database
 * @param fn
 */
Lrucache.prototype.sets = function(key, objs, lifetime, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    var docs = [];
    var value = '';

    if($util.isFunction(lifetime)) {
        fn = lifetime;
        lifetime = 1800;
    }

    if($util.isArray(objs)) {
        objs.map(function(obj) {
            if($util.isA(obj, me.model)) {
                var doc = {};
                Object.keys(columns).map(function(pro) {
                    var field = columns[pro];
                    doc[field] = obj[pro];
                });
                docs.push(doc);
            }
        });
    }
};
/**
 * 
 * @param database
 * @param fn
 */
Lrucache.prototype.get = function(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
};
/**
 * 
 * @param database
 * @param fn
 */
Lrucache.prototype.gets = function(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
};
/**
 * 
 * @param database
 * @param fn
 */
Lrucache.prototype.del = function(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
};
