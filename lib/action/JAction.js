var Scope = require('../util/Scope');
var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

function JAction(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res));
    /**
     * @api protected
     */
    this.scope = new Scope(req);
    this.template.init();
}

$util.inherits(JAction, Action);

module.exports = exports = JAction;

JAction.prototype.launch = function() {
};
