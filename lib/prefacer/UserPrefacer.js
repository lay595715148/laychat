var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');

function UserPrefacer(req, res) {
    Prefacer.call(this, req, res);
    
    this.uservice = Service.factory('UserService');
}

$util.inherits(UserPrefacer, Prefacer);

module.exports = exports = UserPrefacer;

UserPrefacer.prototype.run = function(fn) {
    var scope = this.scope;
    var cookie = scope.cookie();
    var sign = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('SessionService');
    $logger.info(cookie, sign);
    if($util.isDefined(cookie[sign])) {
        sservice.mread(cookie[sign], function(ret) {
            if($util.isA(ret, User)) {
                $util.isFunction(fn) && fn(ret);
            } else {
                $util.isFunction(fn) && fn();
            }
        });
    } else {
        $util.isFunction(fn) && fn();
    }
};
