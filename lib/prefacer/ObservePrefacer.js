var uuid = require('node-uuid');
var md5 = require('../util/MD5');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function ObservePrefacer(req, res, action) {
    Prefacer.call(this, req, res, action);
    this.user = null;
}

$util.inherits(ObservePrefacer, Prefacer);

module.exports = exports = ObservePrefacer;

ObservePrefacer.prototype.run = function(fn) {
    var me = this;
    var scope = this.scope;
    var cookie = scope.cookie();
    var request = scope.request();
    var sign = $config.get('sign.cookie.session') || 'sid';//用来存放session标记的cookie变量
    var sservice = Service.factory('UserService');
    var res = this.response;

    if($util.isDefined(cookie[sign])) {
        sservice.mread(cookie[sign], function(ret) {
            if($util.isA(ret, User)) {
                res.redirect(302, request.refer?request.refer:'/');
            } else {
                me.user = me.request.user = ret;
                me.scope.resolve(true);
                $util.isFunction(fn) && fn();
            }
        });
    } else {
        $util.isFunction(fn) && fn();
    }
};
ObservePrefacer.prototype.update = function(fn) {
    var cookie = this.scope.cookie();
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');
    if($util.isUndefined(cookie[sessid])) {
        var key = cookie[sessid] = md5(uuid.v4());
        this.response.cookie(sessid, key);
        this.scope.resolve(true);
    }
    if(this.user) {
        sservice.mcreate(cookie[sessid], this.user, function(ret) {
            $util.isFunction(fn) && fn(ret);
        });
    }
};
