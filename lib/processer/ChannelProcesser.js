var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Collector = require('../util/Collector');
var Utilities = require('../util/Utilities');
var UserSummary = require('../model/UserSummary');
var ChannelUserProcesser = require('../processer/ChannelUserProcesser');

/**
 * @param io {Object} socket.io
 * @param channel {ChannelSummary}
 */
function ChannelProcesser(io, channel) {
    this.io = io;
    this.channel = channel;
    this._interval = undefined;
}

module.exports = exports = ChannelProcesser;

ChannelProcesser.prototype.init = function() {
    var cs = this.channel, namespace = this.io.of('/' + cs.id);
    
    namespace.on('connection', function(socket) {
        var cup = new ChannelUserProcesser(socket, cs);
        
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
    
    //clean
    this.openClean();
};

ChannelProcesser.prototype.openClean = function(timer) {
    var cs = this.channel;
    if(!Utilities.isNumber(timer))
        timer = 10000;
    
    if(Utilities.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
    this._interval = setInterval(function() {
        cs.cleanUser(namespace);
    }, timer);
};

ChannelProcesser.prototype.closeClean = function() {
    if(Utilities.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
};

