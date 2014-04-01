var Action = $.core.Action;
var Template = $.core.Template;
var Service = $.core.Service;
var User = $.model.User;
var OAuth2Token = $.model.OAuth2Token;
var Async = $.util.Async;
var Scope = $.util.Scope;
var Collector = $.util.Collector;

var invalid_token = $config.get('errors.info.oauth2.invalid.token');
var invalid_token_code = $config.get('errors.code.oauth2.invalid.token');

/**
 * @abstract
 */
function JTAction(name, req, res) {
    Action.call(this, name, req, res, Template.instance('Jade', req, res));
    this.token = null;
}

$util.inherits(JTAction, Action);

module.exports = exports = JTAction;

/**
 * 重写
 * @api public
 */
JTAction.prototype.onStart = function() {
    var me = this;
    var me = this;
    var res = this.response;
    var req = this.request;
    var scope = this.scope;
    var query = scope.request();
    var sign = $config.get('sign.query.oauth2.token', 'token');
    var tservice = Service.factory('OAuth2TokenService');

    if($util.isDefined(query[sign])) {
        tservice.mread(query[sign], function(ret) {
            if($util.isA(ret, OAuth2Token)) {
                //将验证通过的OAuth2Token对象传过来，这里一定是个OAuth2Token
                me.token = req.token = ret;
                scope.resolve(true);
                me.super('onStart');
            } else {
                res.json(Collector.response(false, me.name, invalid_token, invalid_token_code));
                me.emit('stop');
            }
        });
    } else {
        res.json(Collector.response(false, me.name, invalid_token, invalid_token_code));
        me.emit('stop');
    }
};
