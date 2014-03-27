var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var User = $.model.User;

/**
 * @abstract
 */
function JUAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res), Prefacer.instance('UserPrefacer', this));
}

$util.inherits(JUAction, Action);

module.exports = exports = JUAction;

/**
 * 重写
 * @api public
 */
JUAction.prototype.run = function() {
    var me = this;
    this.prefacer.run(function(ret) {
        /*//将验证通过的user对象传过来
        if($util.isA(ret, User)) {
            me.user = ret;
        }*/
        me.dispatch();
    });
    return this;
};
/**
 * @abstract
 */
JUAction.prototype.launch = function() {
};
