var Action = $.core.Action;
var Template = $.core.Template;
var Service = $.core.Service;
var User = $.model.User;
var Async = $.util.Async;

/**
 * @abstract
 */
function JSAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
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
    var res = this.response;
    var req = this.request;
    var scope = this.scope;
    var refer = req.url;
    var cookie = scope.cookie();
    var sign = $config.get('sessid') || 'sessid';
    var sservice = Service.factory('UserService');

    if($util.isDefined(cookie[sign])) {
        sservice.mread(cookie[sign], function(ret) {
            if($util.isA(ret, User)) {
                //将验证通过的User对象传过来，这里一定是个User
                me.user = ret;
                me.super('onStart');
            } else {
                res.redirect(302, '/login?refer=' + encodeURIComponent(refer));
            }
        });
    } else {
        res.redirect(302, '/login?refer=' + encodeURIComponent(refer));
    }
};
