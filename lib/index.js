var ChannelManager = require('./manager/ChannelManager');

module.exports = exports = Laychat;

Laychat.ChannelManager = ChannelManager;
Laychat.createChannel = ChannelManager.createChannel;//[Function]
Laychat.removeChannel = ChannelManager.removeChannel;//[Function]

function Laychat() {
}
