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

function Mongo(model, config, fn) {
    this.model = model;
    this.link = null;
    this.config = config;
    this.result = null;

    this.init(fn);
}

module.exports = exports = Mongo;

/**
 * @api private
 */
Mongo.prototype.init = function(fn) {
    var config = this.config;
    this.link = new Db(config.database, new Server(config.host, config.port), {safe:false});
    //always lazy
};
Mongo.prototype.open = function(fn) {
    var config = this.config;
    var link = this.link;
    link.open(function(err) {
        if(err) {
            throw err;
        } else {
            link.authenticate(config.username, config.password, function(err, res) {
                if(err) {
                    throw err;
                } else if(Utilities.isFunction(fn)) {
                    fn();
                }
            });
        }
    });
};
Mongo.prototype.insert = function() {

};
Mongo.prototype.update = function() {

};
/**
 * delete是关键字，所以要这样写，让eclipse不报错
 */
Mongo.prototype['delete'] = function() {

};
Mongo.prototype.select = function(fields, criteria, opts, fn) {
    var link = this.link;
    this.open(function() {
        link.collection('lay_users').find(criteria, opts).toArray(function(err, result) {
            if(err) {
                throw err;
            } else {
                fn(result);
            }
        });
    });
};
Mongo.prototype.query = function() {

};
