var Store = require('../store/Store');
var mongodb = require('mongodb');
var MongoDB = mongodb.Db;
var Server = mongodb.Server;
var assert = require('assert');

function Mongo(model, config) {
    this.model = model;
    this.config = config;
    this.link = null;
    this.result = null;

    this.init();
}

$util.inherits(Mongo, Store);

module.exports = exports = Mongo;

/**
 * @api private
 */
Mongo.prototype.init = function() {
    var config = this.config;
    this.link = new MongoDB(config.database, new Server(config.host, config.port), { safe : false });
    // always connect lazily
};
/**
 * 连接后可重新选择数据库
 * 
 * @param database
 * @sync
 */
Mongo.prototype.choose = function(database, fn) {
    var me = this;
    var config = this.config;
    if(!$util.isString(database)) {
        database = config.database;
    }
    // 先关闭
    if(!$util.isEmpty(this.link) && this.link.state === 'connected') {
        this.link.close(function() {
            me.link = new MongoDB(database, new Server(config.host, config.port), { safe : false });
            if($util.isFunction(fn)) {
                fn();
            }
        });
    }

};
/**
 * 连接后可重新选择数据库
 * 
 * @param database
 */
Mongo.prototype.change = function(config, fn) {
    if($util.isFunction(config) && $util.isObject(this._config)){
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
    if(!$util.isEmpty(this.link) && this.link.state === 'connected') {
        this.link.close();
    }

    this.link = new MongoDB(database, new Server(config.host, config.port), { safe : false });

    $util.isFunction(fn) && fn(true);
    return true;
};
/**
 * 
 * @param database
 * @param fn
 */
Mongo.prototype.close = function(fn) {
    // 关闭
    if(!$util.isEmpty(this.link) && this.link.state === 'connected') {
        this.link.close(function() {
            $util.isFunction(fn) && fn();
        });
    }

};
/**
 * @api private
 */
Mongo.prototype.connect = function(fn) {
    var config = this.config;
    var link = this.link;
    if(link.state === 'disconnected') {
        link.open(function(err) {
            assert.equal(null, err);
            if(config.username && config.password) {
                link.authenticate(config.username, config.password, function(err, res) {
                    assert.equal(null, err);
                    fn();
                });
            } else {
                fn();
            }
        });
    } else {
        fn();
    }
};
Mongo.prototype.insert = function(docs, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    docs = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection(table).insert(docs, opts, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            fn(result);
        });
    });
};
Mongo.prototype.update = function(selector, docs, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    docs = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection(table).update(selector, docs, opts, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            fn(result);
        });
    });
};
/**
 * delete是关键字，所以使用remove，让eclipse不报错
 */
Mongo.prototype.remove = function(selector, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.connect(function() {
        link.collection(table).remove(selector, opts, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            fn(result);
        });
    });
};
Mongo.prototype.select = function(selector, fields, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    fields = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection(table).find(selector, fields, opts).toArray(function(err, result) {
            assert.equal(null, err);
            me.result = result;
            var items = [];
            result.forEach(function(ret) {
                items.push(new me.model(ret));
            });
            fn(items);
        });
    });
};
Mongo.prototype.selectOne = function(selector, fields, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    fields = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection(table).find(selector, fields, opts).toArray(function(err, result) {
            assert.equal(null, err);
            me.result = result;
            var item = null;
            if(result.length > 0) {
                item = new me.model(result[0]);
            }
            fn(item);
        });
    });
};
Mongo.prototype.count = function(selector, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection(table).count(selector, opts, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            fn(result);
        });
    });
};
