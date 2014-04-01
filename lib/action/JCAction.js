var Action = $.core.Action;
var Prefacer = $.core.Prefacer;
var Template = $.core.Template;
var Service = $.core.Service;
var OAuth2Code = $.model.OAuth2Code;
var User = $.model.User;
var Collector = $.util.Collector;

var invalid_grant = $config.get('errors.info.oauth2.invalid.grant');
var invalid_grant_code = $config.get('errors.code.oauth2.invalid.grant');

/**
 * @abstract
 */
function JCAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
    this.code = null;
}

$util.inherits(JCAction, Action);

module.exports = exports = JCAction;

/**
 * 重写
 * @api public
 */
JCAction.prototype.onStart = function() {
    var me = this;
    var res = this.response;
    var req = this.request;
    var scope = this.scope;
    var query = scope.request();
    var sign = $config.get('sign.query.oauth2.code', 'code');
    var cservice = Service.factory('OAuth2CodeService');

    if($util.isDefined(query[sign])) {
        cservice.mread(query[sign], function(ret) {
            if($util.isA(ret, OAuth2Code)) {
                //将验证通过的OAuth2Code对象传过来
                me.code = req.code = ret;
                scope.resolve(true);
            } else {
                res.json(Collector.response(false, me.action.name, invalid_grant, invalid_grant_code));
            }
            me.super('onStart');
        });
    } else {
        res.json(Collector.response(false, me.action.name, invalid_grant, invalid_grant_code));
        me.super('onStart');
    }
};
