var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function SecurityPrefacer(action) {
    Prefacer.call(this, action);
}

$util.inherits(SecurityPrefacer, Prefacer);

module.exports = exports = SecurityPrefacer;

SecurityPrefacer.prototype.run = function(fn) {
    var res = this.action.response;
    var req = this.action.request;
    var scope = this.action.scope;
    var refer = req.url;
    var cookie = scope.cookie();
    var sign = $config.get('sessid') || 'sessid';
    var sservice = Service.factory('UserService');

    if($util.isDefined(cookie[sign])) {
        sservice.mread(cookie[sign], function(ret) {
            if($util.isA(ret, User)) {
                $util.isFunction(fn) && fn(ret);
            } else {
                res.redirect(302, '/login?refer=' + encodeURIComponent(refer));
            }
        });
    } else {
        res.redirect(302, '/login?refer=' + encodeURIComponent(refer));
    }
};
