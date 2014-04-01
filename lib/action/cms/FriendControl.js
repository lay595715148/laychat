var Collector = $.util.Collector;
var Async = $.util.Async;
var JSAction = $.action.JSAction;
var Template = $.core.Template;
var Prefacer = $.core.Prefacer;
var Service = $.core.Service;
var Friend = $.model.Friend;
var md5 = $.util.MD5;

/**
 * 
 */
function FriendControl(req, res) {
    var name = $config.get('sign.action.cms.friend') || 'cms_friend';
    JSAction.call(this, name, req, res);
}

$util.inherits(FriendControl, JSAction);

module.exports = exports = FriendControl;

FriendControl.prototype.onGet = function() {
    var me = this;
    var fservice = Service.factory('FriendService');
    fservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
        me.super('onGet');
    });
};
