var Validater = require('../util/Validater');
var Collector = require('../util/Collector');
var Service = require('../service/Service');
var User = require('../model/User');
var SocketUser = require('../entity/SocketUser');
var SocketUserSummary = require('../data/SocketUserSummary');
var Processer = require('../processer/Processer');
var MessageProcesser = require('../processer/MessageProcesser');
var MessageData = require('../data/MessageData');

//errors,invalids,exceptions
var no_permission = $config.get('errors.info.permission.user');
var no_permission_code = $config.get('errors.code.permission.user');
var invalid_user = $config.get('errors.info.invalid.user');
var invalid_user_code = $config.get('errors.code.invalid.user');
var invalid_layer = $config.get('errors.info.invalid.layer');
var invalid_layer_code = $config.get('errors.code.invalid.layer');

/**
 * @param {SocketUser}
 *            socketUser
 */
function ChannelUserProcesser(socketUser) {
    this.socketUser = socketUser;
}

$util.inherits(ChannelUserProcesser, Processer);

module.exports = exports = ChannelUserProcesser;

ChannelUserProcesser.prototype.init = function() {
    var me = this;
    var socket = this.socketUser.socket;
    
    //监听一些事件
    socket.on('request', function(data) {
        $logger.debug('do request', $util.toString(data));
        if(Validater.checkRequest(data)) {
            if(data.action == 'login') {
                me.login(data);
            } else if(data.action == 'send' && Validater.checkRequestSend(data.content)) {
                me.send(data.content);
            } else if(data.action == 'list') {
                me.list();
            } else if(data.action == 'update') {
                me.update();
            } else if(data.action == 'into') {
                me.into(data.content.layer);
            } else if(data.action == 'out') {
                me.out();
            } else if(data.action == 'other') {
            }
        }
    }).on('disconnect', function() {
        if(me.user) {
            me.socketUser.setStatus('disconnect');
            me.update();
        }
        $logger.debug('do disconnect');
    }).on('reconnecting', function() {
        if(me.socketUser) {
            me.socketUser.setStatus('reconnecting');
            me.update();
        }
        $logger.debug('do reconnecting');
    });
    
    return this;
};
ChannelUserProcesser.prototype.login = function(data) {
    var me = this, su = this.socketUser, socket = this.socketUser.socket, sc = this.socketUser.channel, rspdata;
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');
    if(su.id == 0) {
        // 用户token验证
        sservice.mread(data[sessid], function(ret) {
            if(ret instanceof User) {
                su.mergeUser(ret);
                /*su.setChannel(cs);
                su.setSocket(socket);*/
                sc.appendUser(su);
                
                su.setStatus('login');
                su.setLayer(sc.layer);
                rspdata = Collector.response(true, 'login', su.toSocketUserSummary());
                socket.emit('response', rspdata);
                $logger.debug('do response', $util.toString(rspdata));

                // 自动进入频道默认层
                socket.join(sc.layer);
                su.setStatus('join');// 修改状态
                me.list();
                me.update();
            } else {
                rspdata = Collector.response(false, 'login', invalid_user, invalid_user_code);
                socket.emit('response', rspdata);
                $logger.debug('do response', $util.toString(rspdata));
            }
        });
    } else {
        rspdata = Collector.response(false, 'login', 'user_logined');
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};

ChannelUserProcesser.prototype.list = function() {
    var su = this.socketUser, socket = this.socketUser.socket, sc = this.socketUser.channel;
    var namespace = socket.namespace, sus = sc.users, list = [], clients, rspdata;
    if(su.id > 0) {
        clients = namespace.clients(su.layer);
        for(var i = 0; i < clients.length; i++) {
            var clientid = clients[i].id;
            if(sus[clientid]) {
                list.push(sus[clientid].toSocketUserSummary());
            }
        }
        rspdata = Collector.response(true, 'list', list);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    } else {
        rspdata = Collector.response(false, 'list', 'invalid_user');
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
ChannelUserProcesser.prototype.update = function() {
    var su = this.socketUser, socket = this.socketUser.socket, sc = this.socketUser.channel, rspdata;
    if(su.id > 0) {
        rspdata = Collector.response(true, 'update', su.toSocketUserSummary());
        socket.to(su.layer).broadcast.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
        if(su.status == 'disconnect') {
            sc.removeUser(su);
        }
    } else {
        rspdata = Collector.response(false, 'update', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
ChannelUserProcesser.prototype.into = function(layer) {
    var su = this.socketUser, socket = this.socketUser.socket, layerid, rspdata;
    if('object' === typeof layer) {
        layerid = layer.id;
    } else {
        layerid = layer;
    }
    if($util.isNumber(layerid) && su.id > 0) {
        if(su.layer != layerid) {
            su.setStatus('leave');
            this.update();
            socket.leave(su.layer);

            su.setLayer(layerid);
            su.setStatus('join');
            socket.join(layerid);

            rspdata = Collector.response(true, 'into', su.toSocketUserSummary());
            socket.emit('response', rspdata);
            $logger.debug('do response', $util.toString(rspdata));
            this.update();
            this.list();
        }
    } else if(su.id == 0) {
        rspdata = Collector.response(false, 'into', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    } else {
        rspdata = Collector.response(false, 'into', invalid_layer, invalid_layer_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};

ChannelUserProcesser.prototype.out = function() {
    var su = this.socketUser, socket = this.socketUser.socket, rspdata;
    if(su.id > 0) {
        rspdata = Collector.response(true, 'out', su.toSocketUserSummary());
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
        su.setStatus('leave');
        this.update();
        socket.leave(su.layer);

        su.setLayer('');
        this.list();
    } else {
        rspdata = Collector.response(false, 'out', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
ChannelUserProcesser.prototype.quit = function() {
    var su = this.socketUser, socket = this.socketUser.socket, rspdata;
    if(su.id > 0) {
        rspdata = Collector.response(true, 'out', su.toSocketUserSummary());
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
        su.setStatus('leave');
        this.update();
        socket.leave(su.layer);

        su.setLayer('');
        this.list();
    } else {
        rspdata = Collector.response(false, 'out', 'invalid_user');
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};

ChannelUserProcesser.prototype.send = function(data) {
    var su = this.socketUser, sc = this.socketUser.channel, socket = this.socketUser.socket, namespace = socket.namespace;
    var sus = sc.users, rspdata, message, mp;
    if(su.id > 0) {//$logger.error(namespace.users);
        message = new MessageData(data);
        mp = new MessageProcesser(su, message);
        mp.release() || mp.cache();
        
        var headers = message.getHeaders();
        var tos = headers.to;
        var from = headers.from;
        var clients = $util.toArray(namespace.clients(su.layer));
        if(from == su.id) {
            rspdata = Collector.response(true, 'send', data);
            if($util.isEmpty(tos)) {
                socket.broadcast.emit('response', rspdata);
            } else {
                if($util.isString(tos)) {
                    tos = tos.split(';');
                    tos.map(function(to, i) {
                        tos[i] = parseInt(to);
                    });
                }
                if($util.isArray(tos)) {
                    clients.map(function(client) {
                        //cl.id is socket id
                        if(sus[client.id] && $util.inArray(sus[client.id].id, tos)) {
                            client.emit('response', rspdata);
                        }
                    });
                }
            }
        } else {
            rspdata = Collector.response(false, 'send', no_permission, no_permission_code);
            socket.emit('response', rspdata);
        }
        $logger.debug('do response', $util.toString(rspdata));
    } else {
        rspdata = Collector.response(false, 'send', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
