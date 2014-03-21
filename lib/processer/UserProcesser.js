var Validater = require('../util/Validater');
var Collector = require('../util/Collector');
var Async = require('../util/Async');
var Service = require('../service/Service');
var User = require('../model/User');
var Pool = require('../pool/Pool');
var SocketUser = require('../entity/SocketUser');
var SocketUserSummary = require('../data/SocketUserSummary');
var Processer = require('../processer/Processer');
var MessageProcesser = require('../processer/MessageProcesser');
var MessageData = require('../data/MessageData');

// errors,invalids,exceptions
var no_permission = $config.get('errors.info.permission.user');
var no_permission_code = $config.get('errors.code.permission.user');
var invalid_user = $config.get('errors.info.invalid.user');
var invalid_user_code = $config.get('errors.code.invalid.user');
var invalid_layer = $config.get('errors.info.invalid.layer');
var invalid_layer_code = $config.get('errors.code.invalid.layer');

/**
 * @param {SocketUser}
 *            socketUser
 */
function UserProcesser(socketUser) {
    this.socketUser = socketUser;
}

$util.inherits(UserProcesser, Processer);

module.exports = exports = UserProcesser;

UserProcesser.prototype.init = function() {
    var me = this;
    var socket = this.socketUser.socket;

    // 监听一些事件
    socket.on('request', function(data) {
        $logger.debug('do request', $util.toString(data));
        if(Validater.checkRequest(data)) {
            if(data.action == 'login') {
                me.login(data);
            } else if(data.action == 'send' && Validater.checkRequestSend(data.content)) {
                me.send(data.content);
            } else if(data.action == 'friends') {
                me.friends();
            } else if(data.action == 'update') {
                me.update();
            } else if(data.action == 'other') {
            }
        }
    }).on('disconnect', function() {
        if(me.socketUser) {
            me.socketUser.setStatus('disconnect');
            me.update();
        }
        $logger.debug('do disconnect');
    }).on('reconnecting', function() {
        if(me.socketUser) {
            me.socketUser.setStatus('reconnecting');
            me.update();
        }
        $logger.debug('do reconnecting');
    });

    return this;
};
UserProcesser.prototype.login = function(data, fn) {
    var me = this, su = this.socketUser, socket = this.socketUser.socket, rspdata;
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var sservice = Service.factory('UserService');
    if(su.id == 0) {
        // 用户token验证
        sservice.mread(data[sessid], function(ret) {
            if($util.isA(ret, User)) {
                su.mergeUser(ret);

                su.setStatus('login');
                rspdata = Collector.response(true, 'login', su.toSocketUserSummary());
                socket.emit('response', rspdata);
                //$logger.debug('do response', $util.toString(rspdata));

                Pool.factory('SocketUserPool').push(su);
                me.friends(function() {
                    me.update();
                });
            } else {
                rspdata = Collector.response(false, 'login', invalid_user, invalid_user_code);
                socket.emit('response', rspdata);
                //$logger.debug('do response', $util.toString(rspdata));
            }
            $util.isFunction(fn) && fn();
        });
    } else {
        rspdata = Collector.response(false, 'login', 'user_logined');
        socket.emit('response', rspdata);
        //$logger.debug('do response', $util.toString(rspdata));
    }
};
// 列出所有好友
UserProcesser.prototype.friends = function(fn) {
    var su = this.socketUser, socket = this.socketUser.socket, aynsc = new Async(), rspdata;
    var friends = [], friendids = [], sup = Pool.factory('SocketUserPool');
    var fservice = Service.factory('FriendService'), uservice = Service.factory('UserService');
    // 处理得到的用户好友
    var _process = function(ret) {
        if(ret && $util.isAs(ret, User)) {
            ret.map(function(u) {
                var suer = sup.get(u.id);
                if(suer) {
                    su.friends[u.id] = suer;// 更新用户好友
                    friends.push(suer.toSocketUserSummary());
                    suer.friends[su.id] = su;// 更新用户好友的好友，是自己
                } else {
                    su.friends[u.id] = new SocketUser(u);// 更新用户好友
                    friends.push(u.toSocketUserSummary());
                }
            });

            rspdata = Collector.response(true, 'friends', friends);
            socket.emit('response', rspdata);
            //$logger.debug('do response', $util.toString(rspdata));
        }
    };
    // 从数据库中读取用户好友的回调函数
    var _USreadByIds = function(ret) {
        _process(ret);
        aynsc.push(fservice.mcreateByUser, [su.id, ret], fservice);
    };
    // 从数据库中读取用户好友关系的回调函数
    var _FSreadByUser = function(ret) {
        if($util.isArray(ret) && !$util.isEmpty(ret)) {
            ret.map(function(f) {
                friendids.push(f.friend);
            });
        }
        // 从数据库中读取用户好友
        aynsc.push(uservice.readByIds, [friendids], uservice, _USreadByIds);
    };
    // 在memcache中读取用户好友的回调函数
    var _FSmreadByUser = function(ret) {
        if($util.isArray(ret) && !$util.isEmpty(ret)) {
            _process(ret);
        } else {
            // 从数据库中读取用户好友关系
            aynsc.push(fservice.readByUser, [su.id], fservice, _FSreadByUser);
        }
    };

    if(su.id > 0) {
        // 读取用户好友关系
        aynsc.push(fservice.mreadByUser, [su.id], fservice, _FSmreadByUser);
        aynsc.exec(function() {
            $util.isFunction(fn) && fn();
        });
    } else {
        rspdata = Collector.response(false, 'friends', 'invalid_user');
        socket.emit('response', rspdata);
        //$logger.debug('do response', $util.toString(rspdata));
    }
};
// 给好友发送自己的更新
UserProcesser.prototype.update = function() {
    var su = this.socketUser, friends = this.socketUser.friends, socket = this.socketUser.socket, rspdata;
    if(su.id > 0) {
        rspdata = Collector.response(true, 'update', su.toSocketUserSummary());
        for( var p in friends) {
            var suer = friends[p];
            if($util.isObject(suer.socket) && !$util.isEmpty(suer.socket)) {
                suer.socket.emit('response', rspdata);
            }
        }
        //$logger.debug('do response', $util.toString(rspdata));
    } else {
        rspdata = Collector.response(false, 'update', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        //$logger.debug('do response', $util.toString(rspdata));
    }
};
UserProcesser.prototype.send = function(data) {
    var su = this.socketUser, sc = this.socketUser.channel, socket = this.socketUser.socket, namespace = socket.namespace;
    var sus = sc.users, rspdata, message, mp;
    if(su.id > 0) {// $logger.error(namespace.users);
        message = new MessageData(data);
        mp = new MessageProcesser(su, message);
        mp.release() || mp.cache();

        var headers = message.getHeaders();
        var tos = headers.to;
        var from = headers.from;
        var clients = $util.toArray(namespace.clients(su.layer));
        if(from == su.id) {
            rspdata = Collector.response(true, 'send', data);
            if($util.isEmpty(tos)) {
                socket.broadcast.emit('response', rspdata);
            } else {
                if($util.isString(tos)) {
                    tos = tos.split(';');
                    tos.map(function(to, i) {
                        tos[i] = parseInt(to);
                    });
                }
                if($util.isArray(tos)) {
                    clients.map(function(client) {
                        // cl.id is socket id
                        if(sus[client.id] && $util.inArray(sus[client.id].id, tos)) {
                            client.emit('response', rspdata);
                        }
                    });
                }
            }
        } else {
            rspdata = Collector.response(false, 'send', no_permission, no_permission_code);
            socket.emit('response', rspdata);
        }
        $logger.debug('do response', $util.toString(rspdata));
    } else {
        rspdata = Collector.response(false, 'send', invalid_user, invalid_user_code);
        socket.emit('response', rspdata);
        $logger.debug('do response', $util.toString(rspdata));
    }
};
