var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var User = $.model.User;

/**
 * @abstract
 */
function JSAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res), Prefacer.instance('SecurityPrefacer', this));
    this.user = null;
}

$util.inherits(JSAction, Action);

module.exports = exports = JSAction;

/**
 * 重写
 * @api public
 */
JSAction.prototype.onStart = function() {
    var me = this;
    this.prefacer.run(function(ret) {
        //将验证通过的User对象传过来，这里一定是个User
        me.user = ret;
        me.super('onStart');
    });
};
