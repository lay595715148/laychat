var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JAction = require('../action/JAction');
var Template = require('../template/Template');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');

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
    var cookie = this.scope.cookie();
    this.template.template('channel.jade');
    this.template.display();
};
