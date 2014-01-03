var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Laychat = require('./src/cn/laysoft/laychat');
var User = require('./src/cn/laysoft/laychat/model/User');
var UserSummary = require('./src/cn/laysoft/laychat/model/UserSummary');
var Channel = require('./src/cn/laysoft/laychat/model/Channel');

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
var allUserSummarys = {};
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
    return true;
};
/**
 * @param c {Channel}
 * @param u {UserSummary}
 */
function createChannel(u, c) {
    if('undefined' === typeof allChannels[c.id]) {
        var channel = null;//当前频道对象Socket服务对象
        var users = {};//当前频道的所有用户索引
        
        channel = io.of('/channel_' + c.id).on('connection', function(socket) {
            var listUser = function() {
                var userlist = [];
                var clients = channel.clients();
                for(var i = 0; i < clients.length; i++) {
                    if(!clients[i].disconnected) 
                        userlist.push(clients[i].id);
                }
                
                socket.emit('list', userlist);
            };
            var updateUser = function() {
                users[socket.id] = u;
                channel.emit('update', {'user':u});
            };
            var intoLayer = function(layer) {
                if('undefined' !== typeof layer && layer) {
                    if('objaect'  === typeof layer)
                        socket.join(layer.id);
                    else 
                        socket.join(layer);
                } else if ('undefined' !== typeof u.layer && u.layer){
                    if('objaect'  === typeof u.layer)
                        socket.join(u.layer.id);
                    else 
                        socket.join(u.layer);
                } else {
                    return;
                }
                console.log('do list user');
                listUser();
            };
            var outLayer = function(layer) {//退出频道层，进入频道大厅
                if('undefined' !== typeof layer && layer) {
                    if('objaect'  === typeof layer)
                        sokect.leave(layer.id);
                    else 
                        sokect.leave(layer);
                } else if ('undefined' !== typeof u.layer && u.layer){
                    if('objaect'  === typeof u.layer)
                        sokect.leave(u.layer.id);
                    else 
                        sokect.leave(u.layer);
                } else {
                    return;
                }
                console.log('do list user');
                listUser();
            };
            
            socket.on('into', function(data) {
                if(u && c) {
                    intoLayer(data.layer);
                }
                console.log('do into');
            }).on('out', function(data) {
                if(u && c) {
                    if(data.layer) {
                        outLayer();
                        u.setLayer();
                    }
                }
                updateUser();
                console.log('do out');
            }).on('send', function(data) {
                var persons = [];
                var clients = channel.clients();
                for(var i = 0; i < clients.length; i++) {
                    if(!clients[i].disconnected) 
                        persons.push(clients[i].id);
                }
                console.log(persons);
                if(checkSendData(data) && u && c) {
                    // TODO
                    socket.broadcast.emit('receive', data);
                } else {
                    
                }
                console.log(data);
                console.log('do send');
            }).on('disconnect', function() {
                if(u && c) {
                    // TODO
                } else {
                    
                }
                console.log('do disconnect');
                u.setStatus('disconnect');
                updateUser();
            }).on('reconnecting', function() {
                if(u && c) {
                    // TODO
                } else {
                    
                }
                console.log('do reconnecting');
                //updateUser('reconnecting');
            });
            console.log('do connect');

            u.setSocket(socket);
            u.setStatus('connection');//设置用户状态
            //自动进入频道大厅，所以将用户进入默认频道层
            intoLayer();//进入默认频道层
            updateUser();
        });
        
        if('undefined' !== typeof allChannels[c.id]) allChannels[c.id] = c;
    }
};
/**
 * @param c {Channel}
 * @param u {UserSummary}
 */
function closeChannel(u, c) {
};

io.of('/channel').on('connection', function (socket) {
    var u = null;//UserSummary
    var c = null;//Channel
    
    socket.on('enter', function(data) {
        if(checkEnterData(data)) {
            c = Channel.generateById(data.channel, data.token);
            u = UserSummary.generateByToken(data.token);
            if(u && c) {
                if('undefined' !== typeof allUserSummarys[u.id]) {
                    allUserSummarys[u.id] = u;
                }
                createChannel(u, c);
                socket.emit('entered', data);
            }
        } else {
            
        }
        
        //socket.disconnect('unauthorized');
        console.log('do enter');
    }).on('disconnect', function() {
        if(u && c) {
            // TODO
        } else {
            
        }
        console.log('do disconnect');
    }).on('reconnecting', function() {
        if(u && c) {
            // TODO
        } else {
            
        }
        console.log('do reconnecting');
    });
    
    console.log('do connect');
});
