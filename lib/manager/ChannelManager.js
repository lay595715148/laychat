var Validater = require('../util/Validater');
var Utilities = require('../util/Utilities');
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
    
    var ioChannel = null;//当前频道Socket服务对象
    var userSummarys = {};//当前频道的所有用户索引
    
    if(ChannelManager.ioChannels[channelid]) {
        ioChannel = ChannelManager.ioChannels[channelid];
        console.log('ioChannel', ioChannel.flags);
        return channelSummary;
    }
    
    ChannelManager.ioChannels[channelid] = ioChannel = io.of('/' + channelid).on('connection', function(socket) {
        var socketid = socket.id;
        var listUser = function() {
            var list = [],clients,room,us = userSummarys[socketid];
            //console.log('listUser', socketid, us, ioChannel.clients(us.layer));
            if(us) {
                clients = ioChannel.clients(us.layer);
                for(var i = 0; i < clients.length; i++) {
                    var client = clients[i],clientid = clients[i].id;
                    if(!client.disconnected && userSummarys[clientid]) {
                        list.push(userSummarys[clientid]);
                    }
                }
                socket.emit('response', Utilities.response(true, 'list', list));
                //socket.to(room).;
            } else {
                
            }
            /*
            for(var i = 0; i < clients.length; i++) {
                if(!clients[i].disconnected && userSummarys[clients[i].id]) {
                    userlist.push(userSummarys[clients[i].id]);
                }
            }
            console.log('socket.room', io.sockets.manager.roomClients[socketid]);
            console.log('socket.room', ioChannel);*/
        };
        var updateUser = function() {
            var us = userSummarys[socket.id];
            /*if(u.status == 'disconnect') {
                console.log('do update user');
                channel.emit('update', {'user':u});
            } else {*/
                socket.broadcast.emit('update', {'user':us});
            //}
            if(us.status == 'disconnect') {
                delete userSummarys[socketid];
            } else {
                userSummarys[socketid] = us;
            }
        };
        var intoLayer = function(layer) {
            var us = userSummarys[socketid];
            var layerid;
            if('undefined' !== typeof layer && layer) {
                if('objaect'  === typeof layer)
                    layerid = layer.id;
                else 
                    layerid = layer;
            } else if ('undefined' !== typeof us.layer && us.layer){
                if('objaect'  === typeof us.layer)
                    layerid = us.layer.id;
                else 
                    layerid = us.layer;
            } else {
                return;
            }

            socket.join(layerid);
            us.setLayer(layerid);
            console.log('do list user');
            listUser();
        };
        var outLayer = function(layer) {//退出频道层，进入频道大厅
            var us = userSummarys[socketid];
            if('undefined' !== typeof layer && layer) {
                if('objaect'  === typeof layer)
                    sokect.leave(layer.id);
                else 
                    sokect.leave(layer);
            } else if ('undefined' !== typeof us.layer && us.layer){
                if('objaect'  === typeof us.layer)
                    sokect.leave(us.layer.id);
                else 
                    sokect.leave(us.layer);
            } else {
                return;
            }
            console.log('do list user');
            listUser();
        };
        
        socket.on('request', function(data) {
            console.log('do request', data);
            var us;
            if(Validater.checkRequest(data)) {
                if(userSummarys[socketid]) {
                    us = userSummarys[socketid];
                } else {
                    us = UserSummary.generateByToken(data.content.token);
                    us.setChannel(channelid);
                    us.setSocket(socket);
                    us.setLayer(channelSummary.layer);//进入默认层
                    socket.join(channelSummary.layer);//进入默认层
                    userSummarys[socketid] = us;
                    console.log('us', us);
                }
                if(data.action == 'login') {
                    us.setStatus('logined');//设置用户状态;
                    socket.emit('response', Utilities.response(true, data.action, data.content));
                } else if(data.action == 'send') {
                    socket.broadcast.emit('response', Utilities.response(true, data.action, data.content));
                } else if(data.action == 'list') {
                    listUser();
                } else if(data.action == 'update') {
                } else if(data.action == 'other') {
                }
            }
            
        }).on('disconnect', function() {
            if(userSummarys[socketid])
                userSummarys[socketid].setStatus('disconnect');
            console.log('do disconnect');
        }).on('reconnecting', function() {
            if(userSummarys[socketid])
                userSummarys[socketid].setStatus('reconnecting');
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
