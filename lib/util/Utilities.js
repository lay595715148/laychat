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
 * 
 * @param success {Boolean}
 * @param action {String|Object}
 * @param content {Object}
 * @returns {Object}
 */
Utilities.response = function(success, action, content) {
    var rsp = new ResponseData();
    rsp.setSuccess(success);
    rsp.setAction(action);console.log('util.isArray(content)', util.isArray(content));
    if(util.isArray(content)) {
        var ld = new ListData();
        ld.setTotal(content.length);
        ld.setList(content);
        rsp.setContent(ld);
    } else if('object' === typeof content || 'number' === typeof content || 'string' === typeof content || 'boolean' === typeof content) {
        rsp.setContent(content);
    }
    return rsp.toJson();
};
Utilities.request = function(data) {
    var req = new RequestData();
    rsp.setSession(data.session);
    rsp.setAction(data.action);
    rsp.setContent(data.content);
    return req;
};