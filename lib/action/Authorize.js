var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');
var Async = require('../util/Async');
var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var UserPrefacer = require('../prefacer/UserPrefacer');
var Template = require('../template/Template');
var UserService = require('../service/UserService');
var ChannelService = require('../service/ChannelService');
var UserSummary = require('../data/UserSummary');
var ChannelSummary = require('../data/ChannelSummary');
var Data = require('../data/Data');

function Authorize(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res), Prefacer.instance('UserPrefacer', req, res));
}

Utilities.inherits(Authorize, Action);

module.exports = exports = Authorize;

Authorize.prototype.launch = function() {
    var me = this;
    var uservice = new UserService();
    var cservice = new ChannelService();
    var users = [];
    var channels = [];
    var async = new Async();
    
    async.push(uservice.list, [], uservice, function(list) {
        list.forEach(function(user, index) {
            list[index] = users[index] = user.toUserSummary();
        });
    });
    async.push(cservice.list, [], cservice, function(list) {
        list.forEach(function(channel, index) {
            list[index] = channels[index] = channel.toChannelSummary();
        });
    });
    async.exec(function(us, cs) {
        me.template.push(Collector.response(true, 'action', {users:Data.list(us[0]), channels:Data.list(cs[0])}));
        //me.template.push(Collector.response(true, 'action', {users:UserSummary.list(users),channels:ChannelSummary.list(channels)}));
        me.template.json();
    });
};
