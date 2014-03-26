var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JSAction = $require('action.JSAction');
var Template = $require('core.Template');
var Prefacer = $require('core.Prefacer');
var Service = $require('core.Service');

/**
 * 
 */
function Index(req, res) {
    var name = $config.get('sign.action.index') || 'index';
    JSAction.call(this, name, req, res);
}

$util.inherits(Index, JSAction);

module.exports = exports = Index;

Index.prototype.launch = function() {
    var cookie = this.scope.cookie();
    this.template.template('user.jade');
    this.template.display();
};
