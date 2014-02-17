var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');
var Async = require('../util/Async');
var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Jade = require('../template/Jade');
var UserService = require('../service/UserService');
var ChannelService = require('../service/ChannelService');
var UserSummary = require('../data/UserSummary');
var ChannelSummary = require('../data/ChannelSummary');

function Authorize(req, res) {
    Action.call(this, req, res, new Jade(req, res), new Prefacer(req, res));
}

Utilities.inherits(Authorize, Action);

module.exports = exports = Authorize;

Authorize.prototype.launch = function() {
    var me = this;
    var uservice = new UserService();
    var cservice = new ChannelService();
    var users = [];
    var channels = [];
    var a = new Async();
    
    a.push(uservice.list, [], uservice, function(list) {
        list.forEach(function(user, index) {
            list[index] = users[index] = user.toUserSummary();
        });
    });
    a.push(cservice.list, [], cservice, function(list) {
        list.forEach(function(channel, index) {
            list[index] = channels[index] = channel.toChannelSummary();
        });
    });
    a.exec(function(us, cs) {
        me.template.push(Collector.response(true, 'action', {users:UserSummary.list(us[0]), channels:ChannelSummary.list(cs[0])}));
        //me.template.push(Collector.response(true, 'action', {users:UserSummary.list(users),channels:ChannelSummary.list(channels)}));
        me.template.json();
    });
    
};
