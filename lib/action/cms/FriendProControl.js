var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JSAction = $require('action.JSAction');
var Template = $require('template.Template');
var Prefacer = $require('prefacer.Prefacer');
var Service = $require('service.Service');
var Friend = $require('model.Friend');
var md5 = $require('util.MD5');

/**
 * 
 */
function FriendProControl(req, res) {
    var name = $config.get('sign.action.cms.friend.pro') || 'cms_friend_pro';
    JSAction.call(this, name, req, res);
}

$util.inherits(FriendProControl, JSAction);

module.exports = exports = FriendProControl;

FriendProControl.prototype.dispatch = function() {
    var params = this.scope.param();
    var id = parseInt(params[0]);
    var operate = params[1];
    this.launch();
};
FriendProControl.prototype.launch = function() {
    var me = this;
    var fservice = Service.factory('FriendService');
    var params = this.scope.param();
    var get = this.scope.get();
    var userid = parseInt(get.user);
    var friendid = parseInt(get.friend);
    var id = parseInt(params[0]);
    var operate = params[1];
    var aynsc = new Async();
    $logger.error(params);
    if(operate == 'add' && userid && friendid) {
        var friend = new Friend();
        friend.setUser(userid);
        friend.setFriend(friendid);
        aynsc.push(fservice.create, [friend], fservice, function(ret) {
            $logger.error('create friend', $util.toString(friend), ret);
        });
    }
    aynsc.push(fservice.list, [], fservice, function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
    aynsc.exec();
};
