var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;

/**
 * observe session cookie id
 * @abstract
 */
function JOAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res), Prefacer.instance('ObservePrefacer', this));
}

$util.inherits(JOAction, Action);

module.exports = exports = JOAction;

JOAction.prototype.onStart = function() {
    var me = this;
    this.prefacer.run(function() {
        me.super('onStart');
    });
};
