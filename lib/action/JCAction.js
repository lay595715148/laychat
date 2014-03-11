var Action = $require('action.Action');
var Prefacer = $require('prefacer.Prefacer');
var Template = $require('template.Template');
var User = $require('model.User');

/**
 * @abstract
 */
function JCAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res, this), Prefacer.instance('OAuth2CodePrefacer', req, res, this));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
    this.code = null;
}

$util.inherits(JCAction, Action);

module.exports = exports = JCAction;

/**
 * 重写
 * @api public
 */
JCAction.prototype.run = function() {
    var me = this;
    this.prefacer.run(function(ret) {
        //将验证通过的OAuth2Code对象传过来
        me.code = ret;
        me.dispatch();
    });
    return this;
};
JCAction.prototype.launch = function() {
};
