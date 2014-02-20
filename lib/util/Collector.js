var ResponseData = require('../data/ResponseData');
var RequestData = require('../data/RequestData');
var ListData = require('../data/ListData');
var Utilities = require('../util/Utilities');

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
    return Utilities.json(rsp);
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
    return Utilities.json(new ListData(list, total, hasNext));
};

function Collector() {
}
