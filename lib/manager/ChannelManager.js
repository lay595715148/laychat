var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Utilities = require('../util/Utilities');
var Channel = require('../model/Channel');
var ChannelSummary = require('../data/ChannelSummary');
var ChannelService = require('../service/ChannelService');
var ChannelProcesser = require('../processer/ChannelProcesser');
var Manager = require('../manager/Manager');

// 频道管理器
function ChannelManager(io) {
    this.io = io;
    this._cps = {};//存放ChannelProcesser数组
}

Utilities.inherits(ChannelManager, Manager);

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
    if(!Utilities.isObject(io) || !Utilities.isNumber(channelid))
        return null;

    if(Utilities.isUndefined(this._cps[channelid])) {
        new ChannelService().read(channelid, function(ret) {
            if(ret instanceof Channel) {
                me._cps[channelid] = new ChannelProcesser(io.of('/' + channelid), ret.toChannelSummary()).init();
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
    if(Utilities.isObject(cs))
        channelid = cs.id;
    else if(Utilities.isNumber(cs))
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
