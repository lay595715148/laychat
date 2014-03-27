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
