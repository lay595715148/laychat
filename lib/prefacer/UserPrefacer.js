var uuid = require('node-uuid');
var md5 = require('../util/MD5');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function UserPrefacer(req, res, action) {
    Prefacer.call(this, req, res, action);
    this.user = null;
}

$util.inherits(UserPrefacer, Prefacer);

module.exports = exports = UserPrefacer;

UserPrefacer.prototype.run = function(fn) {
    var me = this;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        uservice.mread(cookie[sessid], function(ret) {
            if($util.isA(ret, User)) {
                me.user = me.request.user = ret;
                me.scope.resolve(true);
            }
            $util.isFunction(fn) && fn(ret);
        });
    } else {
        $util.isFunction(fn) && fn(false);
    }
};
UserPrefacer.prototype.update = function(fn) {
    var cookie = this.scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');
    if($util.isUndefined(cookie[sessid])) {
        var key = cookie[sessid] = md5(uuid.v4());
        this.response.cookie(sessid, key);
        this.scope.resolve(true);
    }
    if(this.user) {
        uservice.mcreate(cookie[sessid], this.user, function(ret) {
            $util.isFunction(fn) && fn(ret);
        });
    }
};
UserPrefacer.prototype.remove = function(fn) {
    var me = this;
    var cookie = this.scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var uservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        uservice.mremove(cookie[sessid], function(ret) {
            me.user = me.request.user = null;
            me.scope.resolve(true);
            $util.isFunction(fn) && fn(ret);
        });
    } else {
        $util.isFunction(fn) && fn(ret);
    }
};
