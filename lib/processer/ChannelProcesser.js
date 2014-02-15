var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Utilities = require('../util/Utilities');
var ChannelUserProcesser = require('../processer/ChannelUserProcesser');
var Processer = require('../processer/Processer');

/**
 * @param namespace {Object} socket.io
 * @param channel {ChannelSummary}
 */
function ChannelProcesser(namespace, channel) {
    this.namespace = namespace;
    this.channel = channel;
    this._interval = undefined;
}

Utilities.inherits(ChannelProcesser, Processer);

module.exports = exports = ChannelProcesser;

ChannelProcesser.prototype.init = function() {
    var cs = this.channel;

    this.namespace.on('connection', function(socket) {
        var cup = new ChannelUserProcesser(socket, cs);
        
        //监听一些事件
        socket.on('request', function(data) {
            $logger.debug('do request', Utilities.toString(data));
            if(Validater.checkRequest(data)) {
                if(data.action == 'login') {
                    cup.login(data);
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
            $logger.debug('do disconnect');
        }).on('reconnecting', function() {
            if(cup.user) {
                cup.user.setStatus('reconnecting');
                cup.update();
            }
            $logger.debug('do reconnecting');
        });

        $logger.debug('do connect in ChannelProcesser', cs.id);
    });
    
    //clean
    this.openClean();
    
    return this;
};

ChannelProcesser.prototype.openClean = function(timer) {
    var cs = this.channel, namespace = this.namespace;
    
    timer = Utilities.isNumber(timer) ? timer : 10000;
    
    if(Utilities.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
    this._interval = setInterval(function() {
        cs.cleanUser(namespace);
    }, 10000);
};

ChannelProcesser.prototype.closeClean = function() {
    if(Utilities.isDefined(this._interval)) {
        clearInterval(this._interval);
    }
};

