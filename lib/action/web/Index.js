var Collector = $.util.Collector;
var Async = $.util.Async;
var JSAction = $.action.JSAction;
var Template = $.core.Template;
var Prefacer = $.core.Prefacer;
var Service = $.core.Service;

/**
 * 
 */
function Index(req, res) {
    var name = $config.get('sign.action.index') || 'index';
    JSAction.call(this, name, req, res);
}

$util.inherits(Index, JSAction);

module.exports = exports = Index;

Index.prototype.onGet = function() {
    var cookie = this.scope.cookie();
    this.template.template('user.jade');
    this.template.display();
    this.super('onGet');
};
