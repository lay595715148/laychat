var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function ObservePrefacer(req, res) {
    Prefacer.call(this, req, res);
}

$util.inherits(ObservePrefacer, Prefacer);

module.exports = exports = ObservePrefacer;

ObservePrefacer.prototype.run = function(fn) {
    var scope = this.scope;
    var cookie = scope.cookie();
    var sessid = $config.get('sessid') || 'sessid';//用来存放session标记的cookie变量
    var sservice = Service.factory('SessionService');
    $logger.info(cookie, sessid);
    if($util.isDefined(cookie[sessid])) {
        sservice.mread(cookie[sessid], function(ret) {
            if(ret === false) {
                $util.isFunction(fn) && fn();
            } else {
                res.redirect(302, '/index');
            }
        });
    } else {
        $util.isFunction(fn) && fn();
    }
};
