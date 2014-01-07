var ChannelManager = require('./manager/ChannelManager');

function Laychat() {
}
module.exports = exports = Laychat;

Laychat.createChannel = ChannelManager.createChannel;
Laychat.removeChannel = ChannelManager.removeChannel;