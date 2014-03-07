var uuid = require('node-uuid');
var md5 = require('../util/MD5');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function SessionUserPrefacer(req, res) {
    Prefacer.call(this, req, res);
    this.user = null;
}

$util.inherits(SessionUserPrefacer, Prefacer);

module.exports = exports = SessionUserPrefacer;

SessionUserPrefacer.prototype.run = function(fn) {
    var me = this;
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        sservice.mread(cookie[sessid], function(ret) {
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
SessionUserPrefacer.prototype.update = function(fn) {
    var cookie = this.scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');
    if($util.isUndefined(cookie[sessid])) {
        var key = cookie[sessid] = md5(uuid.v4());
        this.response.cookie(sessid, key, {path:'/'});
        this.scope.resolve(true);
    }
    if(this.user) {
        sservice.mcreate(cookie[sessid], this.user, function(ret) {
            $util.isFunction(fn) && fn(ret);
        });
    }
};
SessionUserPrefacer.prototype.remove = function(fn) {
    var me = this;
    var cookie = this.scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');

    if($util.isDefined(cookie[sessid])) {
        sservice.mremove(cookie[sessid], function(ret) {
            me.user = me.request.user = null;
            me.scope.resolve(true);
            $util.isFunction(fn) && fn(ret);
        });
    } else {
        $util.isFunction(fn) && fn(ret);
    }
};
