var uuid = require('node-uuid');
var md5 = $.util.MD5;
var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var Service = $.core.Service;
var User = $.model.User;
var Collector = $.util.Collector;
var Async = $.util.Async;

/**
 * observe session cookie id
 * @abstract
 */
function JOAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
}

$util.inherits(JOAction, Action);

module.exports = exports = JOAction;

JOAction.prototype.onStart = function() {
    var me = this;
    var res = this.response;
    var req = this.request;
    var scope = this.scope;
    var cookie = scope.cookie();
    var request = scope.request();
    var sign = $config.get('sign.cookie.session') || 'sid';//用来存放session标记的cookie变量
    var sservice = Service.factory('UserService');

    if($util.isDefined(cookie[sign])) {
        sservice.mread(cookie[sign], function(ret) {
            if($util.isA(ret, User)) {
                res.redirect(302, request.refer?request.refer:'/');
            } else {
                me.user = req.user = ret;
                scope.resolve(true);
                me.super('onStart');
            }
        });
    } else {
        me.super('onStart');
    }
};
/**
 * @protected
 */
JOAction.prototype.update = function(fn) {
    var res = this.response;
    var req = this.request;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');
    if($util.isUndefined(cookie[sessid])) {
        var key = cookie[sessid] = md5(uuid.v4());
        res.cookie(sessid, key);
        scope.resolve(true);
    }
    if(req.user) {
        sservice.mcreate(cookie[sessid], req.user, function(ret) {
            $util.isFunction(fn) && fn(ret);
        });
    }
};
