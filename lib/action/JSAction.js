var Action = $require('action.Action');
var Prefacer = $require('prefacer.Prefacer');
var Template = $require('template.Template');
var User = $require('model.User');

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
JSAction.prototype.run = function() {
    var me = this;
    this.prefacer.run(function(ret) {
        //将验证通过的User对象传过来，这里一定是个User
        me.user = ret;
        me.dispatch();
    });
    return this;
};
JSAction.prototype.launch = function() {
};
