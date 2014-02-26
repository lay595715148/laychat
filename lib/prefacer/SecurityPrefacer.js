var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function SessionPrefacer(req, res) {
    Prefacer.call(this, req, res);
}

$util.inherits(SessionPrefacer, Prefacer);

module.exports = exports = SessionPrefacer;

SessionPrefacer.prototype.run = function(fn) {
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sessid') || 'sessid';
    var sservice = Service.factory('SessionService');
    $logger.info(cookie, sessid);
    if($util.isDefined(cookie[sessid])) {
        sservice.mread(cookie[sessid], function(ret) {
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
