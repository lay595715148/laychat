var http = require('http');
var express = require('express');
var fs = require('fs');
var util = require('util');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//var $ = require('jquery').create();
var Laychat = require('./lib');

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

io.of('/channel').on('connection', function (socket) {
    socket.on('request', function(data) {
        if(Laychat.checkRequest(data)) {
            console.log(data);
            var cs = Laychat.createChannel(data.content.channelid, io);
            if(cs) {
                socket.emit('response', {'success':true, 'action':data.action, 'content':Laychat.extend(data.content, cs.toChannel())});
            } else {
                socket.emit('response', {'success':false, 'action':data.action, 'content':data.content});
            }
        } else {
            socket.emit('response', {'success':false, 'action':data.action, 'content':data.content});
        }
        console.log('do request in channel');
    }).on('disconnect', function() {
        console.log('do disconnect in channel');
    }).on('reconnecting', function() {
        console.log('do reconnecting in channel');
    });
    
    console.log('do connect in channel');
});
