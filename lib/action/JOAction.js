var Action = $require('action.Action');
var Prefacer = $require('prefacer.Prefacer');
var Template = $require('template.Template');

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
