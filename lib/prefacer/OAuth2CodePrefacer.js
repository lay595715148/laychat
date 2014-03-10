var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var Async = require('../util/Async');
var Scope = require('../util/Scope');
var Collector = require('../util/Collector');

/**
 * 默认是OAuth2
 */
function OAuth2CodePrefacer(req, res, action) {
    Prefacer.call(this, req, res, action);
}

$util.inherits(OAuth2CodePrefacer, Prefacer);

module.exports = exports = OAuth2CodePrefacer;

OAuth2CodePrefacer.prototype.run = function(fn) {
    var scope = this.scope;
    var query = scope.request();
    var sign = $config.get('sign.query.oauth2.code', 'code');
    var cservice = Service.factory('OAuth2CodeService');

    if($util.isDefined(query[sign])) {
        cservice.mread(query[sign], function(ret) {
            if($util.isA(ret, User)) {
                $util.isFunction(fn) && fn(ret);
            } else {
                res.json(Collector.response(false, 'code', 'invalid_code'));
            }
        });
    } else {
        res.json(Collector.response(false, 'code', 'invalid_code'));
    }
};
