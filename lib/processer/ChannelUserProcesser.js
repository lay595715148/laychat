var Validater = require('../util/Validater');
var Collector = require('../util/Collector');
var Service = require('../service/Service');
var User = require('../model/User');
var UserSocketSummary = require('../data/UserSocketSummary');
var Processer = require('../processer/Processer');

/**
 * @param {Socket}
 *            socket
 * @param {UserSocketSummary}
 *            user
 * @param {ChannelSocketSummary}
 *            channel
 */
function ChannelUserProcesser(socket, channel, user) {
    this.socket = socket;
    this.channel = channel;
    this.user = user;
    this.uservice = Service.factory('UserService');
}

$util.inherits(ChannelUserProcesser, Processer);

module.exports = exports = ChannelUserProcesser;

ChannelUserProcesser.prototype.login = function(data) {
    var me = this, us = this.user, socket = this.socket, cs = this.channel, rspdata;
    if(!$util.isObject(us) && $util.isObject(cs)) {
        // 用户token验证
        this.uservice.read(data.content.token, function(ret) {
            if(ret instanceof User) {
                us = me.user = ret.toUserSocketSummary();
                us.setChannel(cs);
                us.setSocket(socket);
                cs.appendUser(us);
                
                us.setStatus('login');
                us.setLayer(cs.layer);
                rspdata = Collector.response(true, 'login', us);
                socket.emit('response', rspdata);
                $logger.debug('do response', $util.toString(rspdata));

                // 自动进入频道默认层
                socket.join(cs.layer);
                us.setStatus('join');// 修改状态
                me.list();
                me.update();
            } else {
                rspdata = Collector.response(false, 'login', 'invalid_user');
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
    var us = this.user, socket = this.socket, cs = this.channel, namespace = socket.namespace, uss = cs.users, list = [], clients, rspdata;
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
        rspdata = Collector.response(true, 'update', us);
        socket.to(us.layer).broadcast.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
        if(us.status == 'disconnect') {
            cs.removeUser(us);
        }
    } else {
        rspdata = Collector.response(false, 'update', 'invalid_user');
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

            rspdata = Collector.response(true, 'into', us);
            socket.emit('response', rspdata);
            $logger.debug('do response', rspdata);
            this.update();
            this.list();
        }
    } else if(!$util.isObject(us)) {
        rspdata = Collector.response(false, 'into', 'invalid_user');
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    } else {
        rspdata = Collector.response(false, 'into', 'invalid_layer');
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};

ChannelUserProcesser.prototype.out = function() {
    var us = this.user, socket = this.socket, rspdata;
    if($util.isObject(us)) {
        rspdata = Collector.response(true, 'out', us);
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
    var us = this.user, socket = this.socket, rspdata;
    if($util.isObject(us)) {
        rspdata = Collector.response(true, 'send', data.content);
        socket.broadcast.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    } else {
        rspdata = Collector.response(false, 'send', 'invalid_user');
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
