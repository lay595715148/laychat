var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JAction = require('../action/JAction');
var Template = require('../template/Template');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var Channel = require('../model/Channel');

/**
 * 
 */
function ChannelAction(req, res) {
    var name = $config.get('sign.action.channel') || 'channel';
    JAction.call(this, name, req, res);
}

$util.inherits(ChannelAction, JAction);

module.exports = exports = ChannelAction;

ChannelAction.prototype.launch = function() {
    var me = this;
    /*var cservice = Service.factory('ChannelService');
    var c = new Channel();
    c.setName('channelname' + Math.floor(Math.random() * 100000));
    c.setLayer(1);
    cservice.create(c, function(ret) {
    });*/
    var cookie = me.scope.cookie();
    me.template.template('channel.jade');
    me.template.display();
};
