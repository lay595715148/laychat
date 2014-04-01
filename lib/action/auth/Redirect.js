var Collector = $.util.Collector;
var Async = $.util.Async;
var JCAction = $.action.JCAction;
var Template = $.core.Template;
var Service = $.core.Service;
var Model = $.model.Model;

function Redirect(req, res) {
    var name = $config.get('sign.action.redirect', 'redirect');
    JCAction.call(this, name, req, res);
}

$util.inherits(Redirect, JCAction);

module.exports = exports = Redirect;

Redirect.prototype.onGet = function() {
    this.template.push(Collector.response(true, this.name, this.code.toOAuth2CodeSummary()));
    this.template.json();
    this.super('onGet');
};

