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
    var async = new Async();
    var uservice = Service.factory('SessionService');
    $logger.info(cookie, sessid);
    if($util.isDefined(cookie[sessid])) {
        res.redirect(302, '/main');
    } else {
        $util.isFunction(fn) && fn();
    }
};
