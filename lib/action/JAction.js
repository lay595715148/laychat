var Action = $require('core.Action');
var Prefacer = $require('core.Prefacer');
var Template = $require('core.Template');

/**
 * @abstract
 */
function JAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
}

$util.inherits(JAction, Action);

module.exports = exports = JAction;

JAction.prototype.launch = function() {
};
