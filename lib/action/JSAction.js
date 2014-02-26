var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

function JSAction(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res), Prefacer.instance('SecurityPrefacer', req, res));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
    this.template.init();
}

$util.inherits(JSAction, Action);

module.exports = exports = JSAction;

JSAction.prototype.launch = function() {
};
