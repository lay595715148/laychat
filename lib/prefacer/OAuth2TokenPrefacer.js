var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');
var Collector = require('../util/Collector');

/**
 * 默认是OAuth2
 */
function OAuth2TokenPrefacer(req, res) {
    Prefacer.call(this, req, res);
}

$util.inherits(OAuth2TokenPrefacer, Prefacer);

module.exports = exports = OAuth2TokenPrefacer;

OAuth2TokenPrefacer.prototype.run = function(fn) {
    var scope = this.scope;
    var query = scope.request();
    var sign = $config.get('sign.query.oauth2.token') || 'token';
    var tservice = Service.factory('TokenService');
    $logger.info(cookie, sign);
    if($util.isDefined(query[sign])) {
        tservice.mread(query[sign], function(ret) {
            if($util.isA(ret, User)) {
                $util.isFunction(fn) && fn(ret);
            } else {
                res.json(Collector.response(false, 'token', {message:'invalid_token'}));
            }
        });
    } else {
        res.json(Collector.response(false, 'token', {message:'invalid_token'}));
    }
};
