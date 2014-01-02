var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Laychat = require('./src/cn/laysoft/laychat');
var User = require('./src/cn/laysoft/laychat/model/User');

server.listen(8132);

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
    res.sendfile(__dirname + '/static/html/index.html');
});
app.get('/:t', function(req, res) {
    /*io.sockets.on('connection', function(socket) {
        socket.emit('news', {
            content : req.params.t
        });
        console.log('OK');
    });*/
    res.send('OK');
});
app.post('/authorize', function(req, res) {
    /*io.sockets.on('connection', function(socket) {
        socket.emit('news', {
            content : req.params.t
        });
        console.log('OK');
    });*/
    res.send('OK');
});

var global_sockets = {};
var chat_clients = {"sockectid":{},"userid":{}};

var chat = io
.of('/chat').on('connection', function (socket) {
    var checkSendData = function(data) {
        if('undefined' == typeof data.from) {
            return false;
        } else {
            
        }
        if('undefined' == typeof data.to) {
            return false;
        }
        if('undefined' == typeof data.content) {
            return false;
        }
        return true;
    };
    var convertTo2Tos = function(to) {
        var tos = [];
        if('string' == typeof to && to != '') {
            var toArr = to.split(';');
            tos = toArr;
        }
        return tos;
    };
    var recordData = function(data) {
        
    };
    var listPerson = function() {
        var persons = [];
        var clients = chat.clients();
        for(var i = 0; i < clients.length; i++) {
            if(!clients[i].disconnected) 
                persons.push(clients[i].id);
        }
        
        socket.emit('list person', persons);
    };
    var updatePerson = function(status) {
        chat.emit('update person', {'sockectid':socket.id, 'status':status});
    };
    var u = new User();
    
    socket.on('send', function(data) {
        console.log(chat_clients);
        console.log('SOCKET ID:' + socket.id);
        if(checkSendData(data)) {
            var tos = convertTo2Tos(data.to);
            if(tos.length > 0) {
                for(var i in tos) {
                    if(socket.sockets(tos[i]))
                        socket.sockets(tos[i]).emit('receive', data);
                }
            } else {;
                chat.emit('receive', data);
            }
            console.log(chat.clients('room'));
            recordData(data);
        } else {
            socket.emit('error', 'yours!');
        }
        Laychat.send({}, 'aaaaaaaaaa');
    }).on('login', function(data) {
        chat_clients.userid[data.userid] = socket.id;
    }).on('disconnect', function() {
        if('undefined' != typeof chat_clients.sockectid[socket.id]) 
            delete chat_clients.sockectid[socket.id];
        updatePerson('disconnect');
        console.log('do disconnect');
    }).on('reconnecting', function(userid) {
        chat_clients.sockectid[socket.id] = socket.id;
        //chat_clients.userid[userid] = socket.id;
        console.log(arguments);
        console.log('do reconnecting');
        updatePerson('reconnecting');
    });

    u.setSocket(socket);
    chat_clients.sockectid[socket.id] = socket.id;
    chat_clients.userid[socket.id] = socket.id;

    listPerson();
    updatePerson('connect');
    console.log('do connect');
    //socket.sockets(socket.id).emit('scokets', io.of('/chat').clients());
});
