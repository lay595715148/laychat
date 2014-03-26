var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JSAction = $require('action.JSAction');
var Template = $require('core.Template');
var Prefacer = $require('core.Prefacer');
var Service = $require('core.Service');
var User = $require('model.User');
var md5 = $require('util.MD5');

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
