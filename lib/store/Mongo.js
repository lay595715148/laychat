var mongodb = require('mongodb');
var MongoDB = mongodb.Db;
var Server = mongodb.Server;
var assert = require('assert');
var Store = $.core.Store;
var Async = $.util.Async;

function Mongo(model, config) {
    this.model = model;
    this.config = config;
    this.sequence = $util.isString(config.sequence) && config.sequence ? config.sequence : 'lay_sequence';
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
    this.link = new MongoDB(config.database, new Server(config.host, config.port), { safe : true });
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
            me.link = new MongoDB(database, new Server(config.host, config.port), { safe : true });
            $util.isFunction(fn) && fn();
        });
    }

};
/**
 * 连接后可重新选择数据库
 * 
 * @param database
 */
Mongo.prototype.change = function(config, fn) {
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
    if(!$util.isEmpty(this.link) && this.link.state === 'connected') {
        this.link.close();
    }

    this.link = new MongoDB(database, new Server(config.host, config.port), { safe : true });

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
                    $util.isFunction(fn) && fn();
                });
            } else {
                $util.isFunction(fn) && fn();
            }
        });
    } else {
        $util.isFunction(fn) && fn();
    }
};
/**
 * @api private
 * @param name
 * @param fn
 * @returns
 */
Mongo.prototype.nextSequence = function(name, step, fn) {
    var me = this;
    var table = this.model.table();
    var link = this.link;
    var sequence = this.sequence;//sequence数据表
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    name = args.length ? args.shift() || '_id' : '_id';
    name = table + '.' + name;
    step = args.length ? args.shift() || 1 : 1;
    step = $util.isInteger(step) ? step : 1;

    this.connect(function() {
        link.collection(sequence).findAndModify({ name : name }, [], { $inc : { seq : step } }, { 'new':true }, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            $util.isFunction(fn) && fn(result.seq);
        });
    });
};
Mongo.prototype.insert = function(obj, opts, fn) {
    var me = this;
    var docs = {};
    var async = new Async();
    var link = this.link;
    var model = this.model;
    var table = this.model.table();
    var columns = this.model.columns();
    var sequence = this.model.sequence ? this.model.sequence() : this.model.prototype.sequence();
    var primary = this.model.primary ? this.model.primary() : this.model.prototype.primary();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    obj = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};

    if(!$util.isA(obj, model)) {
        $util.isFunction(fn) && fn(false);
        return false;
    }

    Object.keys(columns).map(function(pro, index) {
        var field = columns[pro];
        if(field === sequence && (!$util.isInteger(obj[sequence]) || obj[sequence] !== 0)) {
            async.push(me.nextSequence, [sequence], me, function(next) {
                docs[field] = next;
            });
        } else {
            docs[field] = obj[pro];
        }
    });
    
    async.push(me.connect, [], me, function() {
        link.collection(table).insert(docs, opts, function(err, result) {
            assert.equal(null, err);
            me.result = result;
            $util.isFunction(fn) && fn(result);
        });
    });
    async.exec();
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
            $util.isFunction(fn) && fn(result);
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
            $util.isFunction(fn) && fn(result);
        });
    });
};
Mongo.prototype.select = function(selector, fields, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var columns = this.model.columns();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    fields = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection(table).find(selector, fields, opts).toArray(function(err, result) {
            assert.equal(null, err);
            me.result = result;
            var items = [], obj = {};
            result.forEach(function(ret) {
                // 映射回去
                Object.keys(columns).map(function(pro) {
                    obj[pro] = ret[columns[pro]];
                });
                items.push(new me.model(obj));
            });
            $util.isFunction(fn) && fn(items);
        });
    });
};
Mongo.prototype.selectOne = function(selector, fields, opts, fn) {
    var me = this;
    var link = this.link;
    var table = this.model.table();
    var columns = this.model.columns();
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    fields = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection(table).find(selector, fields, opts).toArray(function(err, result) {
            assert.equal(null, err);
            me.result = result;
            var item = null, obj = {};
            if(result.length > 0) {
                Object.keys(columns).map(function(pro) {
                    obj[pro] = result[0][columns[pro]];
                });
                item = new me.model(obj);
            }
            $util.isFunction(fn) && fn(item);
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
            $util.isFunction(fn) && fn(result);
        });
    });
};
