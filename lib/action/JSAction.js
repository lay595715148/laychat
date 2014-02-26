var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');
var User = require('../model/User');

function JSAction(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res), Prefacer.instance('SecurityPrefacer', req, res));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
    this.user = null;
    this.template.init();
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
