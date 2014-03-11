var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JCAction = $require('action.JCAction');
var Prefacer = $require('prefacer.Prefacer');
var Template = $require('template.Template');
var Service = $require('service.Service');
var Model = $require('model.Model');

function Redirect(req, res) {
    var name = $config.get('sign.action.redirect', 'redirect');
    JCAction.call(this, name, req, res);
}

$util.inherits(Redirect, JCAction);

module.exports = exports = Redirect;

Redirect.prototype.dispatch = function() {
    this.launch();
};
Redirect.prototype.launch = function() {
    this.template.push(Collector.response(true, this.name, this.code.toOAuth2CodeSummary()));
    this.template.json();
};

