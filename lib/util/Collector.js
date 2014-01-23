var ResponseData = require('../model/ResponseData');
var RequestData = require('../model/RequestData');
var ListData = require('../model/ListData');
var Utilities = require('./Utilities');

module.exports = exports = Collector;

/**
 * 以JSON格式响应输出
 * 
 * @param success
 *            {Boolean}
 * @param action
 *            {String|Object}
 * @param content
 *            {Object|String|Number|Boolean}
 * @returns {Object}
 */
Collector.response = function(success, action, content) {
    var rsp = new ResponseData();
    rsp.setSuccess(success);
    rsp.setAction(action);
    if(success && Utilities.isArray(content)) {
        rsp.setContent(Collector.list(content, content.length, false));
    } else {
        rsp.setContent(content);
    }
    return rsp.toJson();
};
/**
 * 
 * @param data
 *            {Object}
 * @returns {RequestData}
 */
Collector.request = function(data) {
    var req = new RequestData();
    rsp.setSession(data.session);
    rsp.setAction(data.action);
    rsp.setContent(data.content);
    return req;
};
/**
 * 用于response响应时以JSON格式输出
 * 
 * @param list
 *            {Array}
 * @param total
 *            {Number}
 * @param hasNext
 *            {Boolean}
 * @returns {Object}
 */
Collector.list = function(list, total, hasNext) {
    var ld = new ListData();
    ld.setList(list);
    ld.setTotal(total);
    ld.setHasNext(hasNext);
    return ld.toJson();
};

function Collector() {
}

/**
 * @returns {Array}
 */
Array.prototype.toJson = function() {
    var me = this;
    this.forEach(function(item, index, arr) {
        if(Utilities.isObject(item) && Utilities.isFunction(item.toJson)) {
            me[index] = item.toJson();
        }
    });
    return this;
};
Object.prototype.toJson = function() {
    var target = {};
    for( var prop in this) {
        var item = this[prop];
        if(Utilities.isObject(item) && Utilities.isFunction(item.toJson)) {
            target[prop] = item.toJson();
        } else {
            target[prop] = item;
        }
    }
    return target;
};
