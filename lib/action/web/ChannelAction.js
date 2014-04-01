var Collector = $.util.Collector;
var Async = $.util.Async;
var JAction = $.action.JAction;
var Template = $.core.Template;
var Prefacer = $.core.Prefacer;
var Service = $.core.Service;
var Channel = $.model.Channel;

/**
 * 
 */
function ChannelAction(req, res) {
    var name = $config.get('sign.action.channel') || 'channel';
    JAction.call(this, name, req, res);
}

$util.inherits(ChannelAction, JAction);

module.exports = exports = ChannelAction;

ChannelAction.prototype.onGet = function() {
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
    me.super('onGet');
};
