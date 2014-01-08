var Validater = require('../util/Validater');
var UserSummary = require('../model/UserSummary');
var ChannelSummary = require('../model/ChannelSummary');


//频道管理器
function ChannelManager() {
}

module.exports = exports = ChannelManager;
/**
 * @var {Object}
 */
ChannelManager.ioChannels = {};//channel id => io Channel

/**
 * 创建频道
 * @param channelid {Number}
 * @param io {Object}
 * @returns {ChannelSummary}
 */
ChannelManager.createChannel = function(channelid, io) {
    if(!io || !channelid) {
        return null;
    }

    var channelSummary = ChannelSummary.generateById(channelid);
    if(!channelSummary) {
        return null;
    }
    
    var ioChannel = null;//当前频道对象Socket服务对象
    var users = {};//当前频道的所有用户索引
    
    if(ChannelManager.ioChannels[channelid]) {
        ioChannel = ChannelManager.ioChannels[channelid];
        return channelSummary;
    }
    
    ChannelManager.ioChannels[channelid] = ioChannel = io.of('/channel_' + channelid).on('connection', function(socket) {
        var socketid = socket.id;
        var listUser = function() {
            var user = users[socket.id];
            var userlist = [];
            var clients = channel.clients();
            for(var i = 0; i < clients.length; i++) {
                if(!clients[i].disconnected && users[clients[i].id]) {
                    userlist.push(users[clients[i].id]);
                }
            }
            console.log('socket.room', io.sockets.manager.roomClients[socket.id]);
            console.log('socket.room', ioChannel);
            socket.emit('list', userlist);
        };
        var updateUser = function() {
            var user = users[socket.id];
            /*if(u.status == 'disconnect') {
                console.log('do update user');
                channel.emit('update', {'user':u});
            } else {*/
                socket.broadcast.emit('update', {'user':user});
            //}
            if(user.status == 'disconnect') {
                delete users[socket.id];
            } else {
                users[socket.id] = user;
            }
        };
        var intoLayer = function(layer) {
            var user = users[socket.id];
            var layerid;
            if('undefined' !== typeof layer && layer) {
                if('objaect'  === typeof layer)
                    layerid = layer.id;
                else 
                    layerid = layer;
            } else if ('undefined' !== typeof user.layer && user.layer){
                if('objaect'  === typeof user.layer)
                    layerid = user.layer.id;
                else 
                    layerid = user.layer;
            } else {
                return;
            }

            socket.join(layerid);
            user.setLayer(layerid);
            console.log('do list user');
            listUser();
        };
        var outLayer = function(layer) {//退出频道层，进入频道大厅
            var user = users[socket.id];
            if('undefined' !== typeof layer && layer) {
                if('objaect'  === typeof layer)
                    sokect.leave(layer.id);
                else 
                    sokect.leave(layer);
            } else if ('undefined' !== typeof user.layer && user.layer){
                if('objaect'  === typeof user.layer)
                    sokect.leave(user.layer.id);
                else 
                    sokect.leave(user.layer);
            } else {
                return;
            }
            console.log('do list user');
            listUser();
        };
        
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
    
    return channelSummary;
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