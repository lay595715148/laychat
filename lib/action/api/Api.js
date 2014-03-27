var Collector = $.util.Collector;
var Async = $.util.Async;
var JTAction = $.action.JTAction;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var Service = $.core.Service;
var Model = $.model.Model;

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

