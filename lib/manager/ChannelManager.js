var Validater = $.util.Validater;
var Factory = $.util.Factory;
var Channel = $.model.Channel;
var Processer = $.core.Processer;
var Service = $.core.Service;
var Entity = $.core.Entity;
var Manager = $.core.Manager;

// 频道管理器
function ChannelManager(io, channelid) {
    this.io = io;
    this.channelid = channelid;
    this._sc = {};
    this._interval = undefined;
    //this._cps = {};//存放ChannelProcesser数组
}

$util.inherits(ChannelManager, Manager);

module.exports = exports = ChannelManager;

ChannelManager.instances = {};
ChannelManager.factory = function(io, channelid) {
    var args = Array.prototype.slice.call(arguments, 0);
    if($util.isUndefined(ChannelManager.instances[channelid])) {
        ChannelManager.instances[channelid] = {};
    }
    args.unshift('manager.');
    args.unshift('ChannelManager');
    args.unshift(ChannelManager.instances[channelid]);
    return Factory.factory.apply(null, args);
};

/**
 * 创建频道
 * 
 * @param channelid
 *            {Number}
 * @param io
 *            {Object}
 * @returns {Boolean}
 */
ChannelManager.prototype.open = function(fn) {
    var me = this;
    var io = this.io, channelid = this.channelid, sc = this._sc;
    var cs = Service.factory('ChannelService');
    
    if(!$util.isObject(io) || !$util.isNumber(channelid)) {
        $util.isFunction(fn) && fn(false);
        return false;
    }
    
    cs.read(channelid, function(ret) {
        if($util.isA(ret, Channel)) {
            me._sc = ret.toSocketChannel(), namespace = io.of('/' + channelid);
            
            me._sc.setNamespace(namespace);
            namespace.on('connection', function(socket) {
                var su = Entity.instance('SocketUser');
                
                su.setSocket(socket);
                su.setChannel(me._sc);
                Processer.instance('ChannelUserProcesser', su).init();

                $logger.debug('do connect in ChannelProcesser', sc.id);
            });
            
            //clean
            me.openClean();
            
            $logger.info('channel ' + channelid + ' is ready!');
            $util.isFunction(fn) && fn(true);
        }
    });
};

/**
 * 
 * @param {ChannelSummary} cs
 * @returns {Boolean}
 */
ChannelManager.prototype.close = function(fn) {
    var channelid = this.channelid, sc = this._sc, clients;
    if(!$util.isObject(io) || $util.isEmpty(sc)) {
        $util.isFunction(fn) && fn(false);
        return false;
    }

    clients = sc.namespace.clients();
    
    for(var i = 0; i < clients.length; i++) {
        clients[i].removeAllListeners();
        clients[i].disconnect();
        //delete io.sockets.sockets[clients[i].id];
    }
    sc.namespace.removeAllListeners();
    delete this.io.namespaces['/' + channelid];
    $util.isFunction(fn) && fn(true);
};
ChannelManager.prototype.openClean = function(timer) {
    var sc = this._sc, timer = $util.isNumber(timer) ? timer : 10000;
    
    if($util.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
    this._interval = setInterval(function() {
        sc.cleanUser();
    }, 10000);
};

ChannelManager.prototype.closeClean = function() {
    if($util.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
};
