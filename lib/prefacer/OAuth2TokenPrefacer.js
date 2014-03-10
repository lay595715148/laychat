var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var OAuth2Token = require('../model/OAuth2Token');
var Async = require('../util/Async');
var Scope = require('../util/Scope');
var Collector = require('../util/Collector');

/**
 * 默认是OAuth2
 */
function OAuth2TokenPrefacer(req, res, action) {
    Prefacer.call(this, req, res, action);
    this.token = null;
}

$util.inherits(OAuth2TokenPrefacer, Prefacer);

module.exports = exports = OAuth2TokenPrefacer;

OAuth2TokenPrefacer.prototype.run = function(fn) {
    var me = this;
    var res = this.response;
    var scope = this.scope;
    var query = scope.request();
    var invalid_token = $config.get('errors.info.oauth2.invalid.token');
    var invalid_token_code = $config.get('errors.code.oauth2.invalid.token');
    var sign = $config.get('sign.query.oauth2.token', 'token');
    var tservice = Service.factory('OAuth2TokenService');

    if($util.isDefined(query[sign])) {
        tservice.mread(query[sign], function(ret) {
            if($util.isA(ret, OAuth2Token)) {
                me.token = me.request.token = ret;
                me.scope.resolve(true);
                $util.isFunction(fn) && fn(ret);
            } else {
                res.json(Collector.response(false, me.action.name, invalid_token, invalid_token_code));
            }
        });
    } else {
        res.json(Collector.response(false, me.action.name, invalid_token, invalid_token_code));
    }
};
