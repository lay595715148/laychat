var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var User = $.model.User;

/**
 * @abstract
 */
function JCAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res), Prefacer.instance('OAuth2CodePrefacer', this));
    this.code = null;
}

$util.inherits(JCAction, Action);

module.exports = exports = JCAction;

/**
 * 重写
 * @api public
 */
JCAction.prototype.onStart = function() {
    var me = this;
    this.prefacer.run(function(ret) {
        //将验证通过的OAuth2Code对象传过来
        me.code = ret;
        me.super('onStart');
    });
};
