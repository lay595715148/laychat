var ResponseData = require('../model/ResponseData');
var RequestData = require('../model/RequestData');
var ListData = require('../model/ListData');
var util = require('util');

function Utilities() {
    this.id = 0;
}
module.exports = exports = Utilities;

Utilities.extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};
/**
 * 以JSON格式响应输出
 * @param success {Boolean}
 * @param action {String|Object}
 * @param content {Object|String|Number|Boolean}
 * @returns {Object}
 */
Utilities.response = function(success, action, content) {
    var rsp = new ResponseData();
    rsp.setSuccess(success);
    rsp.setAction(action);
    if(success && util.isArray(content)) {
        rsp.setContent(Utilities.list(content, content.length, false));
    } else {
        rsp.setContent(content);
    }
    return rsp.toJson();
};
/**
 * 
 * @param data {Object}
 * @returns {RequestData}
 */
Utilities.request = function(data) {
    var req = new RequestData();
    rsp.setSession(data.session);
    rsp.setAction(data.action);
    rsp.setContent(data.content);
    return req;
};
/**
 * 用于response响应时以JSON格式输出
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 * @returns {Object}
 */
Utilities.list = function(list, total, hasNext) {
    var ld = new ListData();
    ld.setList(list);
    ld.setTotal(total);
    ld.setHasNext(hasNext);
    return ld.toJson();
};

/**
 * @returns {Array}
 */
Array.prototype.toJson = function() {
    this.forEach(function(item, index, arr) {
        if('function' === typeof item.toJson) {
            item = item.toJson();
        }
    });
    console.log('do it');
    return this;
};