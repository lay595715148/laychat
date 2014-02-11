var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Utilities = require('../util/Utilities');
var logger = require('../util/Logger').logger;
var ChannelSummary = require('../model/ChannelSummary');
var ChannelProcesser = require('../processer/ChannelProcesser');

// 频道管理器
function ChannelManager(io) {
    this.io = io;
    this._cps = {};//存放ChannelProcesser数组
}

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
    var io = this.io;
    if(!Utilities.isObject(io) || !Utilities.isNumber(channelid))
        return null;

    var cp;//ChannelProcesser
    if(Utilities.isDefined(this._cps[channelid])) {
        cp = this._cps[channelid];
    } else {
        cp = this._cps[channelid] = new ChannelProcesser(io.of('/' + channelid), ChannelSummary.generateById(channelid));
        cp.init();
    }
    
    return cp;
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
