var Collector = $.util.Collector;
var Async = $.util.Async;
var JAction = $.action.JAction;
var Template = $.core.Template;
var Prefacer = $.core.Prefacer;
var Service = $.core.Service;
var User = $.model.User;
var md5 = $.util.MD5;

var invalid_user = $config.get('errors.info.invalid.user');
var invalid_user_code = $config.get('errors.code.invalid.user');

/**
 * 
 */
function UserAction(req, res) {
    var name = $config.get('sign.action.user') || 'user';
    JAction.call(this, name, req, res);
}

$util.inherits(UserAction, JAction);

module.exports = exports = UserAction;

UserAction.prototype.onGet = function() {
    var me = this;
    var uservice = Service.factory('UserService');
    var params = this.scope.param();
    var userid = parseInt(params[0]);
    /*var u = new User();
    
    u.setName('name' + Math.floor(Math.random() * 10000));
    u.setNick('lay' + Math.floor(Math.random() * 1000));
    u.setPass(md5('yuiopas'));
    
    uservice.list(function(ret) {
        var cookie = me.scope.cookie();
        me.template.push(Collector.response(true, me.name, ret));
        me.template.template('channel.jade');
        me.template.json();
    });*/
    
    uservice.read(userid, function(ret) {
        if($util.isA(ret, User)) {
            ret = ret.toUserSummary();
            me.template.push(Collector.response(true, me.name, ret));
            me.template.json();
        } else {
            me.template.push(Collector.response(false, me.name, invalid_user, invalid_user_code));
            me.template.json();
        }
        me.super('onGet');
    });
};
