var Validater = require('../util/Validater');
var Collector = require('../util/Collector');
var Service = require('../service/Service');
var User = require('../model/User');
var SocketUser = require('../flesh/SocketUser');
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
 * @param {Socket}
 *            socket
 * @param {SocketUserSummary}
 *            user
 * @param {ChannelSocketSummary}
 *            channel
 */
function ChannelUserProcesser(socket, channel, user) {
    this.socket = socket;
    this.channel = channel;
    this.user = user;
}

$util.inherits(ChannelUserProcesser, Processer);

module.exports = exports = ChannelUserProcesser;

ChannelUserProcesser.prototype.login = function(data) {
    var me = this, us = this.user, socket = this.socket, cs = this.channel, rspdata;
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');
    if(!$util.isObject(us) && $util.isObject(cs)) {
        // 用户token验证
        sservice.mread(data[sessid], function(ret) {
            if(ret instanceof User) {
                us = me.user = ret.toSocketUser();
                us.setChannel(cs);
                us.setSocket(socket);
                cs.appendUser(us);
                
                us.setStatus('login');
                us.setLayer(cs.layer);
                rspdata = Collector.response(true, 'login', us.toSocketUserSummary());
                socket.emit('response', rspdata);
                $logger.debug('do response', $util.toString(rspdata));

                // 自动进入频道默认层
                socket.join(cs.layer);
                us.setStatus('join');// 修改状态
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
    var us = this.user, socket = this.socket, cs = this.channel;
    var namespace = socket.namespace, uss = cs.users, list = [], clients, rspdata;
    if($util.isObject(us)) {
        clients = namespace.clients(us.layer);
        for(var i = 0; i < clients.length; i++) {
            var clientid = clients[i].id;
            if(uss[clientid]) {
                list.push(uss[clientid]);
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
    var us = this.user, socket = this.socket, cs = this.channel, rspdata;
    if($util.isObject(us)) {
        rspdata = Collector.response(true, 'update', us.toSocketUserSummary());
        socket.to(us.layer).broadcast.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
        if(us.status == 'disconnect') {
            cs.removeUser(us);
        }
    } else {
        rspdata = Collector.response(false, 'update', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
ChannelUserProcesser.prototype.into = function(layer) {
    var us = this.user, socket = this.socket, layerid, rspdata;
    if('object' === typeof layer) {
        layerid = layer.id;
    } else {
        layerid = layer;
    }
    if($util.isNumber(layerid) && $util.isObject(us)) {
        if(us.layer != layerid) {
            us.setStatus('leave');
            this.update();
            socket.leave(us.layer);

            us.setLayer(layerid);
            us.setStatus('join');
            socket.join(layerid);

            rspdata = Collector.response(true, 'into', us.toSocketUserSummary());
            socket.emit('response', rspdata);
            $logger.debug('do response', $util.toString(rspdata));
            this.update();
            this.list();
        }
    } else if(!$util.isObject(us)) {
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
    var us = this.user, socket = this.socket, rspdata;
    if($util.isObject(us)) {
        rspdata = Collector.response(true, 'out', us.toSocketUserSummary());
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
        us.setStatus('leave');
        this.update();
        socket.leave(us.layer);

        us.setLayer('');
        this.list();
    } else {
        rspdata = Collector.response(false, 'out', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
ChannelUserProcesser.prototype.quit = function() {
    var us = this.user, socket = this.socket, rspdata;
    if($util.isObject(us)) {
        rspdata = Collector.response(true, 'out', us.toSocketUserSummary());
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
        us.setStatus('leave');
        this.update();
        socket.leave(us.layer);

        us.setLayer('');
        this.list();
    } else {
        rspdata = Collector.response(false, 'out', 'invalid_user');
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};

ChannelUserProcesser.prototype.send = function(data) {
    var us = this.user, cs = this.channel, socket = this.socket, namespace = socket.namespace;
    var uss = cs.users, rspdata, message, mp;
    if($util.isObject(us)) {$logger.error(namespace.users);
        mp = new MessageProcesser(socket, us);
        message = new MessageData(data.content);
        mp.release(message) || mp.cache(message);
        
        var headers = message.getHeaders();
        var tos = headers.to;
        var from = headers.from;
        var clients = $util.toArray(namespace.clients(us.layer));
        if(from == this.user.id) {
            rspdata = Collector.response(true, 'send', data.content);
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
                        if(uss[client.id] && $util.inArray(uss[client.id].id, tos)) {
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
