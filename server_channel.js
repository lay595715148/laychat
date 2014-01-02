var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Laychat = require('./src/cn/laysoft/laychat');
var User = require('./src/cn/laysoft/laychat/model/User');
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
var checkEnterData = function(data) {
    if('undefined' == typeof data.token) {
        return false;
    }
    if('undefined' == typeof data.channel || isNaN(data.channel)) {
        return false;
    }
    return true;
};
var checkIntoData = function(data) {
    if('undefined' == typeof data.token) {
        return false;
    }
    if('undefined' == typeof data.layer || isNaN(data.layer)) {
        return false;
    }
    return true;
};
var checkSendData = function(data) {
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
 * @param u {User}
 */
var createChannel = function(u, c) {
    var channel = null;
    if(allChannels[c.id]) console.log(55555);
    if(c.id && 'undefined' === typeof allChannels[c.id]) {
        channel = allChannels[c.id] = io.of('/channel_' + c.id).on('connection', function(socket) {
            socket.on('into', function(data) {
                if(u && c) {
                    createChannel(u, c);
                    u.setSocket(socket);
                    if(data.layer) sokect.join(data.layer);
                }
            }).on('out', function(data) {
                if(u && c) {
                    if(data.layer) sokect.leave(data.layer);
                }
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
            }).on('reconnecting', function() {
                if(u && c) {
                    // TODO
                } else {
                    
                }
                console.log('do reconnecting');
            });
            console.log('do connect');
        });
    }
};
var closeChannel = function(u, c) {
};
var channel = io.of('/channel').on('connection', function (socket) {
    var u = null;
    var c = null;
    
    socket.on('enter', function(data) {
        if(checkEnterData(data)) {
            u = User.generateByToken(data.token);
            c = Channel.generateById(data.channel, data.token);
            if(u && c) {
                createChannel(u, c);
                socket.emit('created', data);
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
