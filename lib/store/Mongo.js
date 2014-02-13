var Utilities = require('../util/Utilities');
var mongodb = require('mongodb');
var Db = mongodb.Db;
var MongoClient = mongodb.MongoClient;
var Server = mongodb.Server;
var ReplSetServers = mongodb.ReplSetServers;
var ObjectID = mongodb.ObjectID;
var Binary = mongodb.Binary;
var GridStore = mongodb.GridStore;
var Grid = mongodb.Grid;
var Code = mongodb.Code;
var BSON = mongodb.pure().BSON;
var assert = require('assert');

function Mongo(model, config) {
    this.model = model;
    this.link = null;
    this.config = config;
    this.result = null;

    this.init();
}

module.exports = exports = Mongo;

/**
 * @api private
 */
Mongo.prototype.init = function() {
    var config = this.config;
    this.link = new Db(config.database, new Server(config.host, config.port), {safe:false});
    //always lazy
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
                    if(Utilities.isFunction(fn)) {
                        fn();
                    }
                });
            } else {
                if(Utilities.isFunction(fn)) {
                    fn();
                }
            }
        });
    } else {
        if(Utilities.isFunction(fn)) {
            fn();
        }
    }
};
Mongo.prototype.insert = function() {

};
Mongo.prototype.update = function(selector, document, opts, fn) {
    var me = this;
    var link = this.link;
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
};
/**
 * delete是关键字，所以要这样写，让eclipse不报错
 */
Mongo.prototype['delete'] = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
};
Mongo.prototype.select = function(selector, fields, opts, fn) {
    var me = this;
    var link = this.link;
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    fields = args.length ? args.shift() || [] : [];
    opts = args.length ? args.shift() || {} : {};
    
    this.connect(function() {
        link.collection('lay_users').find(selector, opts).toArray(function(err, result) {
            assert.equal(null, err);
            me.result = result;
            fn(result);
        });
    });
};
Mongo.prototype.count = function(selector, opts, fn) {
    var me = this;
    var link = this.link;
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};

    this.connect(function() {
        link.collection('lay_users').count(selector, opts).toArray(function(err, result) {
            assert.equal(null, err);
            me.result = result;
            fn(result);
        });
    });
};
