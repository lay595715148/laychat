var ChannelManager = require('./manager/ChannelManager');
var Utilities = require('./util/Utilities');
var Validater = require('./util/Validater');

function Laychat() {
}

module.exports = exports = Laychat;

Laychat.ChannelManager = ChannelManager;
Laychat.Utilities = Utilities;
Laychat.Validater = Validater;

Laychat.createChannel = ChannelManager.createChannel;//[Function]
Laychat.removeChannel = ChannelManager.removeChannel;//[Function]
Laychat.extend = Utilities.extend;
Laychat.checkRequest = Validater.checkRequest;
