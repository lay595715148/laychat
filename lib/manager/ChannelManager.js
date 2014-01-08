var Validater = require('../util/Validater');
var UserSummary = require('../model/UserSummary');


//创建一个没有存在的频道
function ChannelManager() {
}

module.exports = exports = ChannelManager;

ChannelManager.ioChannels = {};//channel id => io Channel

ChannelManager.createChannel = function(channelSummary, io) {
    if(!io || !channelSummary) {
        return false;
    }
    
    var channelid = channelSummary.id;
    var ioChannel = null;//当前频道对象Socket服务对象
    var users = {};//当前频道的所有用户索引
    
    if(ChannelManager.ioChannels[channelid]) {
        ioChannel = ChannelManager.ioChannels[channelid];
        return ioChannel;
    }
    
    ChannelManager.ioChannels[channelid] = ioChannel = io.of('/channel_' + channelid).on('connection', function(socket) {
        var socketid = socket.id;
        socket.on('request', function(data) {
            var user;
            if(Validater.checkRequest(data)) {
                if(users[socketid]) {
                    user = users[socketid];
                } else {
                    user = UserSummary.generateByToken(data.content.token);
                    user.setChannel(channelid);
                    user.setSocket(socket);
                    console.log('do request', user);
                }
                if(data.action == 'login') {
                    user.setStatus('logined');//设置用户状态;
                    socket.emit('response', data);
                } else if(data.action == 'send') {
                    data.session = '';
                    socket.broadcast.emit('response', data);
                }
            }
            
            console.log('do request', data);
        }).on('disconnect', function() {
            if(users[socketid])
                users[socketid].setStatus('disconnect');
            console.log('do disconnect');
        }).on('reconnecting', function() {
            if(users[socketid])
                users[socketid].setStatus('reconnecting');
            console.log('do reconnecting');
        });

        console.log('do connect in ChannelManager');
    });
    
    return ioChannel;
};
ChannelManager.removeChannel = function(channelSummary) {
    if(!channelSummary) {
        return false;
    }
    var channelid = channelSummary.id;
    var ioChannel = null;//当前频道对象Socket服务对象
    
    if(ChannelManager.ioChannels[channelid]) {
        ioChannel = ChannelManager.ioChannels[channelid];
        console.log(ioChannel.__proto__);
        //ioChannel.disconnect();
        //delete ChannelManager.ioChannels[channelid];
    }
};