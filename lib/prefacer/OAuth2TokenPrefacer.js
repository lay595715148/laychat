var Prefacer = $.core.Prefacer;
var Service = $.core.Service;
var OAuth2Token = $.model.OAuth2Token;
var Async = $.util.Async;
var Scope = $.util.Scope;
var Collector = $.util.Collector;

/**
 * 默认是OAuth2
 */
function OAuth2TokenPrefacer(action) {
    Prefacer.call(this, action);
    this.token = null;
}

$util.inherits(OAuth2TokenPrefacer, Prefacer);

module.exports = exports = OAuth2TokenPrefacer;

OAuth2TokenPrefacer.prototype.run = function(fn) {
    var me = this;
    var res = this.action.response;
    var req = this.action.request;
    var scope = this.action.scope;
    var query = scope.request();
    var invalid_token = $config.get('errors.info.oauth2.invalid.token');
    var invalid_token_code = $config.get('errors.code.oauth2.invalid.token');
    var sign = $config.get('sign.query.oauth2.token', 'token');
    var tservice = Service.factory('OAuth2TokenService');

    if($util.isDefined(query[sign])) {
        tservice.mread(query[sign], function(ret) {
            if($util.isA(ret, OAuth2Token)) {
                req.token = ret;
                scope.resolve(true);
                $util.isFunction(fn) && fn(ret);
            } else {
                res.json(Collector.response(false, me.action.name, invalid_token, invalid_token_code));
            }
        });
    } else {
        res.json(Collector.response(false, me.action.name, invalid_token, invalid_token_code));
    }
};
