var assert = require('assert');
var Client = require('memcache').Client;
var Store = $require('core.Store');

function Memcache(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;

    this.init();
}

$util.inherits(Memcache, Store);

module.exports = exports = Memcache;

/**
 * @api private
 */
Memcache.prototype.init = function() {
    var config = this.config;
    this.link = new Client(config.port, config.host);
    // always connect lazily
};
/**
 * 连接后可重新选择数据库
 * 
 * @param database
 * @sync
 */
Memcache.prototype.change = function(config, fn) {
    if($util.isFunction(config) && $util.isObject(this._config)) {
        this.config = this._config;
        this._config = undefined;
        fn = config;
    } else if($util.isObject(config)) {
        if(!$util.isObject(this._config)) {
            this._config = this.config;
        }
        this.config = config;
    } else {
        $util.isFunction(fn) && fn(false);
        return false;
    }

    var config = this.config;

    // 先关闭
    if(!$util.isEmpty(this.link)) {
        this.link.close();
    }

    this.link = new Client(config.port, config.host);

    $util.isFunction(fn) && fn(true);
    return true;
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.close = function(fn) {
    // 关闭
    if(!$util.isEmpty(this.link)) {
        this.link.close();
    }
    $util.isFunction(fn) && fn();
};
/**
 * @api private
 */
Memcache.prototype.connect = function(fn) {
    var link = this.link;
    if(!$util.isEmpty(this.link.conn)) {
        $util.isFunction(fn) && fn();
    } else {
        link.on('connect', function() {
            // no arguments - we've connected
            fn();
        });

        link.on('close', function() {
            // no arguments - connection has been closed
        });

        link.on('timeout', function() {
            // no arguments - socket timed out
        });

        link.on('error', function(e) {
            // there was an error - exception is 1st argument
            $logger.error(e);
        });

        link.connect();
    }
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.set = function(key, obj, lifetime, fn) {
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

    // 连接
    this.connect(function() {
        value = $util.toString(docs);
        link.set(table + '.' + key, value, lifetime, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            $util.isFunction(fn) && fn(result);
        });
    });
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.sets = function(key, objs, lifetime, fn) {
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

    // 连接
    this.connect(function() {
        value = $util.toString(docs);
        link.set(table + '.' + key, value, lifetime, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            $util.isFunction(fn) && fn(result);
        });
    });
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.get = function(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    // 连接
    this.connect(function() {
        link.get(table + '.' + key, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            var item = null, obj = {};
            if(!$util.isEmpty(result)) {
                result = $util.toJson(result);
                Object.keys(columns).map(function(pro) {
                    obj[pro] = result[columns[pro]];
                });
                item = new me.model(obj);
            }
            $util.isFunction(fn) && fn(item);
        });
    });
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.gets = function(key, fn) {
    var me = this;
    var columns = this.model.columns();
    var table = this.model.table();
    var link = this.link;
    // 连接
    this.connect(function() {
        link.get(table + '.' + key, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            var items = [];
            if(!$util.isEmpty(result)) {
                result = $util.toJson(result);
                if($util.isArray(result)) {
                    result.map(function(r) {
                        var obj = {};
                        Object.keys(columns).map(function(pro) {
                            obj[pro] = r[columns[pro]];
                        });
                        items.push(new me.model(obj));
                    });
                }
            }
            $util.isFunction(fn) && fn(items);
        });
    });
};
/**
 * 
 * @param database
 * @param fn
 */
Memcache.prototype.del = function(key, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    // 连接
    this.connect(function() {
        link['delete'].call(link, table + '.' + key, function(err, result) {
            // assert.equal(null, err);
            me.result = result;
            $util.isFunction(fn) && fn(result);
        });
    });
};
