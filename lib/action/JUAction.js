var uuid = require('node-uuid');
var md5 = $.util.MD5;
var Action = $.core.Action;
var Template = $.core.Template;
var Service = $.core.Service;
var User = $.model.User;
var Async = $.util.Async;

/**
 * @abstract
 */
function JUAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
}

$util.inherits(JUAction, Action);

module.exports = exports = JUAction;

/**
 * 重写
 * @api public
 */
JUAction.prototype.onStart = function() {
    var me = this;
    var req = this.request;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        uservice.mread(cookie[sessid], function(ret) {
            if($util.isA(ret, User)) {
                req.user = ret;
                scope.resolve(true);
            }
            me.super('onStart');
        });
    } else {
        me.super('onStart');
    }
};

/**
 * @protected
 */
JUAction.prototype.update = function(fn) {
    var res = this.response;
    var req = this.request;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');
    if($util.isUndefined(cookie[sessid])) {
        var key = cookie[sessid] = md5(uuid.v4());
        res.cookie(sessid, key);
        scope.resolve(true);
    }
    if(req.user) {
        uservice.mcreate(cookie[sessid], req.user, function(ret) {
            $util.isFunction(fn) && fn(ret);
        });
    }
};
/**
 * @protected
 */
JUAction.prototype.remove = function(fn) {
    var req = this.request;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        uservice.mremove(cookie[sessid], function(ret) {
            req.user = null;
            scope.resolve(true);
            $util.isFunction(fn) && fn(ret);
        });
    } else {
        $util.isFunction(fn) && fn(ret);
    }
};
