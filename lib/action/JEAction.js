var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var User = $.model.User;

/**
 * @abstract
 */
function JSAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res), Prefacer.instance('SessionPrefacer', this));
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
        //将session中的用户信息对象传过来
        if($util.isA(ret, User)) {
            me.user = ret;
        }
        me.super('onStart');
    });
};
