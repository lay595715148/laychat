var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function SecurityPrefacer(req, res) {
    Prefacer.call(this, req, res);
}

$util.inherits(SecurityPrefacer, Prefacer);

module.exports = exports = SecurityPrefacer;

SecurityPrefacer.prototype.run = function(fn) {
    var scope = this.scope;
    var cookie = scope.cookie();
    var sign = $config.get('sessid') || 'sessid';
    var sservice = Service.factory('SessionService');

    if($util.isDefined(cookie[sign])) {
        sservice.mread(cookie[sign], function(ret) {
            if($util.isA(ret, User)) {
                $util.isFunction(fn) && fn(ret);
            } else {
                res.redirect(302, '/login');
            }
        });
    } else {
        res.redirect(302, '/login');
    }
};
