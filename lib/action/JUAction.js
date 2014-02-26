var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');
var User = require('../model/User');

function JUAction(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res), Prefacer.instance('UserPrefacer', req, res));
    /**
     * @api protected
     */
    this.scope = this.prefacer.scope;
    this.user = null;
    this.template.init();
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
        //将验证通过的user对象传过来
        if($util.isA(ret, User)) {
            me.user = ret;
        }
        me.dispatch();
    });
    return this;
};
JUAction.prototype.launch = function() {
};
