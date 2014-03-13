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
function UserControl(req, res) {
    var name = $config.get('sign.action.cms.user') || 'cms_user';
    JSAction.call(this, name, req, res);
}

$util.inherits(UserControl, JSAction);

module.exports = exports = UserControl;

UserControl.prototype.launch = function() {
    var me = this;
    var uservice = Service.factory('UserService');
    uservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};