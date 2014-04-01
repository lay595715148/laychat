var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var User = $.model.User;

/**
 * @abstract
 */
function JTAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res), Prefacer.instance('OAuth2TokenPrefacer', this));
    this.token = null;
}

$util.inherits(JTAction, Action);

module.exports = exports = JTAction;

/**
 * 重写
 * @api public
 */
JTAction.prototype.onStart = function() {
    var me = this;
    this.prefacer.run(function(ret) {
        //将验证通过的OAuth2Token对象传过来，这里一定是个OAuth2Token
        me.token = ret;
        me.super('onStart');
    });
};
