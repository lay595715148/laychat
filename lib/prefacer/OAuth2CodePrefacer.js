var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var OAuth2Code = require('../model/OAuth2Code');
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
    var me = this;
    var scope = this.scope;
    var query = scope.request();
    var invalid_grant = $config.get('errors.info.oauth2.invalid.grant');
    var invalid_grant_code = $config.get('errors.code.oauth2.invalid.grant');
    var sign = $config.get('sign.query.oauth2.code', 'code');
    var cservice = Service.factory('CodeService');

    if($util.isDefined(query[sign])) {
        cservice.mread(query[sign], function(ret) {
            if($util.isA(ret, OAuth2Code)) {
                me.code = me.request.code = ret;
                me.scope.resolve(true);
                $util.isFunction(fn) && fn(ret);
            } else {
                res.json(Collector.response(false, me.action.name, invalid_grant, invalid_grant_code));
            }
        });
    } else {
        res.json(Collector.response(false, me.action.name, invalid_grant, invalid_grant_code));
    }
};
