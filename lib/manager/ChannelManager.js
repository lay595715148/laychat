var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Collector = require('../util/Collector');
var Utilities = require('../util/Utilities');
var ChannelSummary = require('../model/ChannelSummary');
var ChannelUserProcesser = require('../processer/ChannelUserProcesser');

// 频道管理器
function ChannelManager() {
    this.namespaces = {};
    this.channels = {};
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
 * @returns {ChannelSummary}
 */
ChannelManager.prototype.createChannel = function(channelid, io) {
    if(!Utilities.isObject(io) || !Utilities.isNumber(channelid))
        return null;

    var cs;
    if(Utilities.isDefined(this.channels[channelid])) {
        cs = this.channels[channelid];
    } else {
        cs = this.channels[channelid] = ChannelSummary.generateById(channelid);
    }

    if(!cs)
        return null;

    if(Utilities.isDefined(this.namespaces[channelid]))
        return cs;

    //初始化事件
    this.namespaces[channelid] = io.of('/' + channelid).on('connection', function(socket) {
        var cup = new ChannelUserProcesser(socket, undefined, cs);
        
        //监听一些事件
        socket.on('request', function(data) {
            console.log('do request', data);
            if(Validater.checkRequest(data)) {
                if(data.action == 'login') {
                    cup.token(data);
                    cup.login();
                } else if(data.action == 'send' && Validater.checkRequestSend(data.content)) {
                    cup.send(data);
                } else if(data.action == 'list') {
                    cup.list();
                } else if(data.action == 'update') {
                    cup.update();
                } else if(data.action == 'into') {
                    cup.into(data.content.layer);
                } else if(data.action == 'out') {
                    cup.out();
                } else if(data.action == 'other') {
                }
            }
        }).on('disconnect', function() {
            if(cup.user) {
                cup.user.setStatus('disconnect');
                cup.update();
                //delete cup;
            }
            console.log('do disconnect');
        }).on('reconnecting', function() {
            if(cup.user) {
                cup.user.setStatus('reconnecting');
                cup.update();
            }
            console.log('do reconnecting');
        });

        console.log('do connect in ChannelManager');
    });

    return cs;
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
