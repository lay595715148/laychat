var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

/**
 * observe session cookie id
 */
function JOAction(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res), Prefacer.instance('ObservePrefacer', req, res));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
    this.template.init();
}

$util.inherits(JOAction, Action);

module.exports = exports = JOAction;

JOAction.prototype.launch = function() {
};
