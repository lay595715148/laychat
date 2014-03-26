var uuid = require('node-uuid');
var md5 = $require('util.MD5');
var Prefacer = $require('core.Prefacer');
var Service = $require('core.Service');
var User = $require('model.User');
var Async = $require('util.Async');
var Scope = $require('util.Scope');

function ObservePrefacer(action) {
    Prefacer.call(this, action);
}

$util.inherits(ObservePrefacer, Prefacer);

module.exports = exports = ObservePrefacer;

ObservePrefacer.prototype.run = function(fn) {
    var res = this.action.response;
    var req = this.action.request;
    var scope = this.action.scope;
    var cookie = scope.cookie();
    var request = scope.request();
    var sign = $config.get('sign.cookie.session') || 'sid';//用来存放session标记的cookie变量
    var sservice = Service.factory('UserService');

    if($util.isDefined(cookie[sign])) {
        sservice.mread(cookie[sign], function(ret) {
            if($util.isA(ret, User)) {
                res.redirect(302, request.refer?request.refer:'/');
            } else {
                req.user = ret;
                scope.resolve(true);
                $util.isFunction(fn) && fn();
            }
        });
    } else {
        $util.isFunction(fn) && fn();
    }
};
ObservePrefacer.prototype.update = function(fn) {
    var res = this.action.response;
    var req = this.action.request;
    var scope = this.action.scope;
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
