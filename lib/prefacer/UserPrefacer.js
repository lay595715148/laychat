var uuid = require('node-uuid');
var md5 = require('../util/MD5');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function UserPrefacer(action) {
    Prefacer.call(this, action);
}

$util.inherits(UserPrefacer, Prefacer);

module.exports = exports = UserPrefacer;

UserPrefacer.prototype.run = function(fn) {
    var req = this.action.request;
    var scope = this.action.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        uservice.mread(cookie[sessid], function(ret) {
            if($util.isA(ret, User)) {
                req.user = ret;
                scope.resolve(true);
            }
            $util.isFunction(fn) && fn(ret);
        });
    } else {
        $util.isFunction(fn) && fn(false);
    }
};
UserPrefacer.prototype.update = function(fn) {
    var res = this.action.response;
    var req = this.action.request;
    var scope = this.action.scope;
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
UserPrefacer.prototype.remove = function(fn) {
    var req = this.action.request;
    var scope = this.action.scope;
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
