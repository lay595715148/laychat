var Action = $require('core.Action');
var Prefacer = $require('core.Prefacer');
var Template = $require('core.Template');

/**
 * observe session cookie id
 * @abstract
 */
function JOAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res), Prefacer.instance('ObservePrefacer', this));
}

$util.inherits(JOAction, Action);

module.exports = exports = JOAction;

JOAction.prototype.launch = function() {
};
