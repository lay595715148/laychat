var Validater = require('../util/Validater');
var Channel = require('../model/Channel');
var Processer = require('../processer/Processer');
var Service = require('../service/Service');
var Manager = require('../manager/Manager');

// 频道管理器
function ChannelManager(io) {
    this.io = io;
    this._cps = {};//存放ChannelProcesser数组
}

$util.inherits(ChannelManager, Manager);

module.exports = exports = ChannelManager;

/**
 * 创建频道
 * 
 * @param channelid
 *            {Number}
 * @param io
 *            {Object}
 * @returns {ChannelProcesser}
 */
ChannelManager.prototype.createChannel = function(channelid) {
    var me = this;
    var io = this.io;
    if(!$util.isObject(io) || !$util.isNumber(channelid))
        return null;

    if($util.isUndefined(this._cps[channelid])) {
        Service.factory('ChannelService').read(channelid, function(ret) {
            if($util.isA(ret, Channel)) {
                me._cps[channelid] = Processer.instance('ChannelProcesser', io.of('/' + channelid), ret.toChannelSocketSummary()).init();
            }
        });
    }
};

/**
 * 
 * @param {ChannelSummary} cs
 * @returns {Boolean}
 */
ChannelManager.prototype.removeChannel = function(cs) {
    var channelid, clients;
    if($util.isObject(cs))
        channelid = cs.id;
    else if($util.isNumber(cs))
        channelid = cs;
    else 
        return false;

    if(this._cps[channelid]) {
        clients = this.io.of('/' + channelid).clients();
        
        for(var i = 0; i < clients.length; i++) {
            clients[i].removeAllListeners();
            clients[i].disconnect();
            //delete io.sockets.sockets[clients[i].id];
        }
        this.io.of('/' + channelid).removeAllListeners();
        delete this.io.namespaces['/' + channelid];
        delete this._cps[channelid];
    }
    return true;
};
