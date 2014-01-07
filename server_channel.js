var http = require('http');
var express = require('express');
var fs = require('fs');
var util = require('util');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//var $ = require('jquery').create();
var Laychat = require('./src/cn/laysoft/laychat');
var User = require('./src/cn/laysoft/laychat/model/User');
var UserSummary = require('./src/cn/laysoft/laychat/model/UserSummary');
var Channel = require('./src/cn/laysoft/laychat/model/Channel');
var ChannelSummary = require('./src/cn/laysoft/laychat/model/ChannelSummary');
/*var jsdom = require('jsdom').jsdom,
    myWindow = jsdom().createWindow(),
    $ = require('jquery').create(),
    jQuery = require('jquery').create(myWindow);*/

server.listen(8133);

app.configure(function() {
    app.set('views', __dirname + '/template');
    app.set('view engine', 'jade');
    app.use("/css", express.static(__dirname + '/static/css'));
    app.use("/jquery", express.static(__dirname + '/static/jquery'));
    app.use("/js", express.static(__dirname + '/static/js'));
    app.use("/image", express.static(__dirname + '/static/image'));

    app.use(express.logger({stream: fs.createWriteStream(__dirname + '/logs/express.log', {flags: 'a'})}));
    //app.use(app.router);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret:'laychat',cookie: { maxAge: 60 * 60 * 1000 }}));
    app.use(express.static(__dirname + '/static'));
    
});
app.get('/', function(req, res) {
    console.log(1101);
    res.sendfile(__dirname + '/static/html/channel.html');
});
app.get('/:t', function(req, res) {
    res.send('OK');
});

var allChannels = {};
var allChannelSummarys = {}; 
var allUserSummarys = {};
function checkRequestData(data) {
    
}
function checkResponseData(data) {
    
}
function checkEnterData(data) {
    if('undefined' == typeof data.token) {
        return false;
    }
    if('undefined' == typeof data.channel || isNaN(data.channel)) {
        return false;
    }
    return true;
};
function checkIntoData(data) {
    if('undefined' == typeof data.token) {
        return false;
    }
    if('undefined' == typeof data.layer || isNaN(data.layer)) {
        return false;
    }
    return true;
};
function checkSendData(data) {
    if('undefined' == typeof data.from) {
        return false;
    }
    if('undefined' == typeof data.to) {
        return false;
    }
    if('undefined' == typeof data.content) {
        return false;
    }
    return true;
};
function checkLoginData(data) {
    if('undefined' == typeof data.token) {
        return false;
    }
    return true;
}
function checkLogoutData(data) {
    return true;
}
/**
 * 
 * @param channel {Channel|Number}
 */
function channelExists(channel) {
    console.log('print channel', channel);
    if('object' === typeof channel) {
        if('undefined' !== typeof allChannelSummarys[channel.id]) {
            return true;
        }
    } else {
        if('undefined' !== typeof allChannelSummarys[channel.id]) {
            return true;
        }
    }
    console.log('print channel 2', channel);
    return false;
}
/**
 * 
 * @param channel {Channel|ChannelSummary}
 */
function signChannel(channel) {
    if('object' === typeof channel) {
        allChannelSummarys[channel.id] = channel;
    }
}
/**
 * 
 * @param channel {User|UserSummary}
 */
function signUser(user) {
    if('object' === typeof user) {
        allUserSummarys[user.id] = user;
    }
}
/**
 * @param cs {ChannelSummary}
 */
function createChannel(cs) {
    if(!channelExists(cs)) {
        console.log('do create channel '+cs.id);
        console.log(allChannelSummarys);
        var channel = null;//当前频道对象Socket服务对象
        var users = {};//当前频道的所有用户索引
        
        channel = io.of('/channel_' + cs.id).on('connection', function(socket) {
            var user;
            var listUser = function() {
                var user = users[socket.id];
                var userlist = [];
                var clients = channel.clients();
                for(var i = 0; i < clients.length; i++) {
                    if(!clients[i].disconnected && users[clients[i].id]) {
                        userlist.push(users[clients[i].id]);
                    }
                }
                console.log('socket.room', io.sockets.manager.roomClients[socket.id]);
                socket.emit('list', userlist);
            };
            var updateUser = function() {
                var user = users[socket.id];
                /*if(u.status == 'disconnect') {
                    console.log('do update user');
                    channel.emit('update', {'user':u});
                } else {*/
                    socket.broadcast.emit('update', {'user':user});
                //}
                if(user.status == 'disconnect') {
                    delete users[socket.id];
                } else {
                    users[socket.id] = user;
                }
            };
            var intoLayer = function(layer) {
                var user = users[socket.id];
                var layerid;
                if('undefined' !== typeof layer && layer) {
                    if('objaect'  === typeof layer)
                        layerid = layer.id;
                    else 
                        layerid = layer;
                } else if ('undefined' !== typeof user.layer && user.layer){
                    if('objaect'  === typeof user.layer)
                        layerid = user.layer.id;
                    else 
                        layerid = user.layer;
                } else {
                    return;
                }

                socket.join(layerid);
                user.setLayer(layerid);
                console.log('do list user');
                listUser();
            };
            var outLayer = function(layer) {//退出频道层，进入频道大厅
                var user = users[socket.id];
                if('undefined' !== typeof layer && layer) {
                    if('objaect'  === typeof layer)
                        sokect.leave(layer.id);
                    else 
                        sokect.leave(layer);
                } else if ('undefined' !== typeof user.layer && user.layer){
                    if('objaect'  === typeof user.layer)
                        sokect.leave(user.layer.id);
                    else 
                        sokect.leave(user.layer);
                } else {
                    return;
                }
                console.log('do list user');
                listUser();
            };
            
            socket.on('login', function(data) {
                if(checkLoginData(data)) {
                    user = UserSummary.generateByToken(data.token);
                    user.setChannel(cs);
                    user.setSocket(socket);
                    user.setStatus('logined');//设置用户状态;
                    users[socket.id] = user;//设置当前频道的用户
                    users[user.id] = user;//设置当前频道的用户
                    signUser(user);
                    socket.emit('receive', extend(data, {"from":"system", "to":user.id, "content":"success"}));
                    
                    //自动进入频道大厅，所以将用户进入默认频道层
                    intoLayer();//进入默认频道层
                    updateUser();
                }
                console.log('do login');
            }).on('logout', function(data) {
                var user = users[socket.id];
                if(user && checkLogoutData(data)) {
                    user.setStatus('logouted');//设置用户状态;
                    updateUser();
                }
                
            }).on('into', function(data) {
                var user = users[socket.id];
                if(user) {
                    intoLayer(data.layer);
                }
                console.log('do into');
            }).on('out', function(data) {
                var user = users[socket.id];
                if(user) {
                    if(data.layer) {
                        outLayer();
                        user.setLayer();
                    }
                    updateUser();
                }
                console.log('do out');
            }).on('send', function(data) {
                var user = users[socket.id];
                if(user) {
                    var persons = [];
                    var clients = channel.clients();
                    for(var i = 0; i < clients.length; i++) {
                        if(!clients[i].disconnected) 
                            persons.push(clients[i].id);
                    }
                    console.log(persons);
                    if(checkSendData(data) && user && cs) {
                        // TODO
                        socket.broadcast.emit('receive', data);
                    } else {
                        
                    }
                }
                console.log(data);
                console.log('do send');
            }).on('disconnect', function() {
                var user = users[socket.id];
                if(user) {
                    // TODO
                    user.setStatus('disconnect');
                    updateUser();
                } else {
                    
                }
                console.log('do disconnect');
            }).on('reconnecting', function() {
                var user = users[socket.id];
                if(user) {
                    // TODO
                } else {
                    
                }
                console.log('do reconnecting');
                //updateUser('reconnecting');
            });

            console.log('do connect');
        });
        cs.setSocket(channel);
        signChannel(cs);
    }
};
/**
 * @param cs {ChannelSummary}
 */
function closeChannel(cs) {
};

io.of('/channel').on('connection', function (socket) {
    var cs = null;//ChannelSummary
    
    socket.on('enter', function(data) {
        if(checkEnterData(data)) {
            cs = ChannelSummary.generateById(data.channel);
            if(cs) {
                Laychat.createChannel(cs, io);
                socket.emit('entered', extend(data, cs.toChannel()));
            }
        } else {
            
        }
        console.log('do enter in channel');
    }).on('disconnect', function() {
        console.log('do disconnect in channel');
    }).on('reconnecting', function() {
        console.log('do reconnecting in channel');
    });
    
    console.log('do connect in channel');
});

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}
