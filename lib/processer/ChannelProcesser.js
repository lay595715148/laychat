var Validater = $.util.Validater;
var Entity = $.core.Entity;
var Processer = $.core.Processer;

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
        var su = Entity.instance('SocketUser');
        
        su.setSocket(socket);
        su.setChannel(sc);
        Processer.instance('ChannelUserProcesser', su).init();

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

