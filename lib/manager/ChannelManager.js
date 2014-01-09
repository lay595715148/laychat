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
        //用户登录，并自动进入频道默认层
        var loginUser = function() {
            var us = userSummarys[socketid];
            if(us) {
                us.setStatus('login');
                us.setLayer(channelSummary.layer);
                socket.emit('response', Utilities.response(true, 'login', us));

                //自动进入频道默认层
                socket.join(channelSummary.layer);
                us.setStatus('join');//修改状态
                listUser();
                updateUser();
            } else {
                socket.emit('response', Utilities.response(false, 'login', 'invalid_user'));
            }
        };
        //列出当前层的所有用户
        var listUser = function() {
            var list = [],clients,us = userSummarys[socketid];
            if(us) {
                clients = ioChannel.clients(us.layer);
                for(var i = 0; i < clients.length; i++) {
                    var client = clients[i],clientid = clients[i].id;
                    if(userSummarys[clientid]) {
                        list.push(userSummarys[clientid]);
                    }
                }
                socket.emit('response', Utilities.response(true, 'list', list));
            } else {
                socket.emit('response', Utilities.response(false, 'list', 'invalid_user'));
            }
        };
        //广播用户更新
        var updateUser = function() {
            var us = userSummarys[socketid];
            if(us) {
                socket.to(us.layer).broadcast.emit('response', Utilities.response(true, 'update', us));
                if(us.status == 'disconnect') {
                    delete userSummarys[socketid];
                }
                console.log(us);
            } else {
                socket.emit('response', Utilities.response(false, 'update', 'invalid_user'));
            }
            console.log('updateUser');
        };
        //进入频道层
        var intoLayer = function(layer) {//layer
            var us = userSummarys[socketid],layerid;
            if('object'  === typeof layer) {
                layerid = layer.id;
            } else {
                layerid = layer;
            }
            if('number' === typeof layerid && us) {
                if(us.layer != layerid) {
                    us.setStatus('leave');
                    updateUser();
                    socket.leave(us.layer);
                    
                    us.setLayer(layerid);
                    us.setStatus('join');
                    socket.join(layerid);
                    
                    socket.emit('response', Utilities.response(true, 'into', us));
                    updateUser();
                    listUser();
                }
            } else if(!us) {
                socket.emit('response', Utilities.response(false, 'into', 'invalid_user'));
            } else {
                socket.emit('response', Utilities.response(false, 'into', 'invalid_layer'));
            }
        };
        var outLayer = function() {//退出频道层，进入频道默认层
            var us = userSummarys[socketid];
            if(us) {
                socket.emit('response', Utilities.response(true, 'out', us));
                intoLayer(channelSummary.layer);
            } else {
                socket.emit('response', Utilities.response(false, 'out', 'invalid_user'));
            }
        };
        var send = function(data) {
            var us = userSummarys[socketid];
            if(us) {
                socket.broadcast.emit('response', Utilities.response(true, 'send', data.content));
            } else {
                socket.emit('response', Utilities.response(false, 'send', 'invalid_user'));
            }
        };
        
        socket.on('request', function(data) {
            console.log('do request', data);
            var us;
            if(Validater.checkRequest(data)) {
                if(userSummarys[socketid]) {
                    us = userSummarys[socketid];
                } else {
                    //用户token验证
                    us = UserSummary.generateByToken(data.content.token);
                    us.setChannel(channelid);
                    us.setSocket(socket);
                    userSummarys[socketid] = us;
                    console.log('us', us);
                }
                if(data.action == 'login') {
                    loginUser();
                } else if(data.action == 'send') {
                    send(data);
                } else if(data.action == 'list') {
                    listUser();
                } else if(data.action == 'update') {
                    updateUser();
                } else if(data.action == 'into') {
                    intoLayer(data.content.layer);
                } else if(data.action == 'out') {
                    outLayer();
                } else if(data.action == 'other') {
                }
            }
            
        }).on('disconnect', function() {
            if(userSummarys[socketid]) {
                userSummarys[socketid].setStatus('disconnect');
                updateUser();
            }
            console.log('do disconnect');
        }).on('reconnecting', function() {
            if(userSummarys[socketid]) {
                userSummarys[socketid].setStatus('reconnecting');
                updateUser();
            }
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
