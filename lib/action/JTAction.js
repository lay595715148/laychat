var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');
var User = require('../model/User');

/**
 * @abstract
 */
function JTAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res, this), Prefacer.instance('TokenPrefacer', req, res, this));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
    this.user = null;
}

$util.inherits(JTAction, Action);

module.exports = exports = JTAction;

/**
 * 重写
 * @api public
 */
JTAction.prototype.run = function() {
    var me = this;
    this.prefacer.run(function(ret) {
        //将验证通过的User对象传过来，这里一定是个User
        me.user = ret;
        me.dispatch();
    });
    return this;
};
JTAction.prototype.launch = function() {
};
