var Action = $require('action.Action');
var Prefacer = $require('prefacer.Prefacer');
var Template = $require('template.Template');

/**
 * observe session cookie id
 * @abstract
 */
function JOAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res, this), Prefacer.instance('ObservePrefacer', req, res, this));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
}

$util.inherits(JOAction, Action);

module.exports = exports = JOAction;

JOAction.prototype.launch = function() {
};
