var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JAction = require('../action/JAction');
var Template = require('../template/Template');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var md5 = require('../util/MD5');

/**
 * 
 */
function UserAction(req, res) {
    var name = $config.get('sign.action.user') || 'user';
    JAction.call(this, name, req, res);
}

$util.inherits(UserAction, JAction);

module.exports = exports = UserAction;

UserAction.prototype.launch = function() {
    var me = this;
    var uservice = Service.factory('UserService');
    var u = new User();
    
    u.setName('name' + Math.floor(Math.random() * 10000));
    u.setNick('lay' + Math.floor(Math.random() * 1000));
    u.setPass(md5('yuiopas'));
    
    uservice.list(function(ret) {
        var cookie = me.scope.cookie();
        me.template.push(Collector.response(true, me.name, ret));
        me.template.template('channel.jade');
        me.template.json();
    });
};
