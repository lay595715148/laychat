var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Collector = require('../util/Collector');
var Utilities = require('../util/Utilities');
var ChannelSummary = require('../model/ChannelSummary');
var ChannelProcesser = require('../processer/ChannelProcesser');

// 频道管理器
function ChannelManager() {
    this.namespaces = {};
    this.channels = {};
    this.cps = {};//存放ChannelProcesser数组
}

ChannelManager.instance = global.$channelManager = global.$channelManager || undefined;
ChannelManager.getInstance = function() {
    if(Utilities.isUndefined(ChannelManager.instance)) {
        ChannelManager.instance = global.$channelManager = new ChannelManager();
    }
    return ChannelManager.instance;
};

module.exports = exports = ChannelManager.getInstance();

/**
 * 创建频道
 * 
 * @param channelid
 *            {Number}
 * @param io
 *            {Object}
 * @returns {ChannelProcesser}
 */
ChannelManager.prototype.createChannel = function(io, channelid) {console.log('createChannel', channelid);
    if(!Utilities.isObject(io) || !Utilities.isNumber(channelid))
        return null;

    var cp;//ChannelProcesser
    if(Utilities.isDefined(this.cps[channelid])) {
        cp = this.cps[channelid];
    } else {
        cp = this.cps[channelid] = new ChannelProcesser(io, ChannelSummary.generateById(channelid));
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
    if(!cs) {
        return false;
    }
    var channelid = cs.id;

    if(this.namespaces[channelid] && this.channels[channelid]) {
        delete this.namespaces[channelid];
        delete this.channels[channelid];
        //console.log(namespace.__proto__);
        // namespace.disconnect();
        // delete ChannelManager.namespaces[channelid];
    }
};
