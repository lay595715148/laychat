var Collector = $.util.Collector;
var Async = $.util.Async;
var JSAction = $.action.JSAction;
var Template = $.core.Template;
var Prefacer = $.core.Prefacer;
var Service = $.core.Service;
var User = $.model.User;
var md5 = $.util.MD5;

/**
 * 
 */
function TokenControl(req, res) {
    var name = $config.get('sign.action.cms.token') || 'cms_token';
    JSAction.call(this, name, req, res);
}

$util.inherits(TokenControl, JSAction);

module.exports = exports = TokenControl;

TokenControl.prototype.launch = function() {
    var me = this;
    var tservice = Service.factory('OAuth2TokenService');
    
    tservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};
