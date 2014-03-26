var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JSAction = $require('action.JSAction');
var Template = $require('core.Template');
var Prefacer = $require('core.Prefacer');
var Service = $require('core.Service');
var Friend = $require('model.Friend');
var md5 = $require('util.MD5');

/**
 * 
 */
function FriendControl(req, res) {
    var name = $config.get('sign.action.cms.friend') || 'cms_friend';
    JSAction.call(this, name, req, res);
}

$util.inherits(FriendControl, JSAction);

module.exports = exports = FriendControl;

FriendControl.prototype.launch = function() {
    var me = this;
    var fservice = Service.factory('FriendService');
    fservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};
