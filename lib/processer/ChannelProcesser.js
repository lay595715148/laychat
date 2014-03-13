var Validater = require('../util/Validater');
var SocketUser = require('../flesh/SocketUser');
var Processer = require('../processer/Processer');

/**
 * @param socketChannel {SocketChannel}
 */
function ChannelProcesser(socketChannel) {
    this.socketChannel = socketChannel;
    this._interval = undefined;
}

$util.inherits(ChannelProcesser, Processer);

module.exports = exports = ChannelProcesser;

ChannelProcesser.prototype.init = function() {
    var sc = this.socketChannel, namespace = sc.namespace;

    namespace.on('connection', function(socket) {
        var su = new SocketUser(), up;
        
        su.setSocket(socket);
        su.setChannel(sc);
        up = Processer.instance('UserProcesser', su);
        
        //监听一些事件
        socket.on('request', function(data) {
            $logger.debug('do request', $util.toString(data));
            if(Validater.checkRequest(data)) {
                if(data.action == 'login') {
                    up.login(data);
                } else if(data.action == 'send' && Validater.checkRequestSend(data.content)) {
                    up.send(data);
                } else if(data.action == 'list') {
                    up.list();
                } else if(data.action == 'update') {
                    up.update();
                } else if(data.action == 'into') {
                    up.into(data.content.layer);
                } else if(data.action == 'out') {
                    up.out();
                } else if(data.action == 'other') {
                }
            }
        }).on('disconnect', function() {
            if(up.user) {
                up.user.setStatus('disconnect');
                up.update();
                //delete up;
            }
            $logger.debug('do disconnect');
        }).on('reconnecting', function() {
            if(up.user) {
                up.user.setStatus('reconnecting');
                up.update();
            }
            $logger.debug('do reconnecting');
        });

        $logger.debug('do connect in ChannelProcesser', sc.id);
    });
    
    //clean
    this.openClean();
    
    return this;
};

ChannelProcesser.prototype.openClean = function(timer) {
    var sc = this.socketChannel, namespace = sc.namespace;
    
    timer = $util.isNumber(timer) ? timer : 10000;
    
    if($util.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
    this._interval = setInterval(function() {
        sc.cleanUser(namespace);
    }, 10000);
};

ChannelProcesser.prototype.closeClean = function() {
    if($util.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
};

