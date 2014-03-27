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
function UserProControl(req, res) {
    var name = $config.get('sign.action.cms.user.pro') || 'cms_user_pro';
    JSAction.call(this, name, req, res);
}

$util.inherits(UserProControl, JSAction);

module.exports = exports = UserProControl;

UserProControl.prototype.dispatch = function() {
    var params = this.scope.param();
    var userid = parseInt(params[0]);
    var operate = params[1];
    this.launch();
};
UserProControl.prototype.launch = function() {
    var me = this;
    var uservice = Service.factory('UserService');
    var params = this.scope.param();
    var userid = parseInt(params[0]);
    var operate = params[1];
    $logger.error(params);
    uservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};
