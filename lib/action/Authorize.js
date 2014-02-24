var Collector = require('../util/Collector');
var Async = require('../util/Async');
var Action = require('../action/Action');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');
var Service = require('../service/Service');

function Authorize(req, res) {
    Action.call(this, req, res, Template.instance('Jade', req, res), Prefacer.instance('UserPrefacer', req, res));
}

$util.inherits(Authorize, Action);

module.exports = exports = Authorize;

Authorize.prototype.launch = function() {
    var me = this;
    var uservice = Service.factory('UserService');
    var cservice = Service.factory('ChannelService');
    var users = [];
    var channels = [];
    var async = new Async();
    //$logger.info(global);

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
        me.template.push(Collector.response(true, 'action', {
            users : Collector.list(users, users ? users.length : 0),
            channels : Collector.list(channels, channels ? channels.length : 0)
        }));
        // me.template.push(Collector.response(true, 'action',
        // {users:UserSummary.list(users),channels:ChannelSummary.list(channels)}));
        me.template.json();
    });
};
