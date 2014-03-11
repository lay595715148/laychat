var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JTAction = $require('action.JTAction');
var Prefacer = $require('prefacer.Prefacer');
var Template = $require('template.Template');
var Service = $require('service.Service');
var Model = $require('model.Model');

/**
 * 
 */
function Api(name, req, res) {
    if(!$util.isString(name)) {
        res = req;
        req = name;
        name = $config.get('sign.action.api', 'api');
    }
    JTAction.call(this, name, req, res);
}

$util.inherits(Api, JTAction);

module.exports = exports = Api;

Api.prototype.dispatch = function() {
    this.launch();
};
Api.prototype.launch = function() {
    this.template.push(Collector.response(true, this.name, this.token.toOAuth2TokenSummary()));
    this.template.json();
};

