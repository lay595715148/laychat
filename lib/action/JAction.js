var Scope = require('../util/Scope');
var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

/**
 * @abstract
 */
function JAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
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
