var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;

/**
 * @abstract
 */
function JAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
}

$util.inherits(JAction, Action);

module.exports = exports = JAction;
