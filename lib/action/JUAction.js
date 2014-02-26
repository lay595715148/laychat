var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

function JUAction(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res), Prefacer.instance('UserPrefacer', req, res));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
    this.template.init();
}

$util.inherits(JUAction, Action);

module.exports = exports = JUAction;

JUAction.prototype.launch = function() {
};
