var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JSAction = $require('action.JSAction');
var Template = $require('template.Template');
var Prefacer = $require('prefacer.Prefacer');
var Service = $require('service.Service');
var User = $require('model.User');
var md5 = $require('util.MD5');

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
