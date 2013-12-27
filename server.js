var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

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
    res.sendfile(__dirname + '/index.html');
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

var chat = io
.of('/chat').on('connection', function (socket) {
    socket.emit('a message', {
        that: 'only',
        '/chat': 'will get'
    });
    chat.emit('a message', {
        everyone: 'in',
        '/chat': 'will get'
    });
    socket.on('send', function(data) {
        console.log(data);
        chat.emit('receive', data);
    });
});
var news = io
.of('/news').on('connection', function (socket) {
    socket.emit('item', { news: 'news' });
}).on('publish', function(socket) {
    
});

var announce = io
.of('/announce').on('connection', function (socket) {
    socket.emit('item', { news: 'announce' });
});

/*io.sockets.on('connection', function(socket) {
    socket.emit('news', {
        hello : 'world'
    });
    socket.on('my other event', function(data) {
        //console.log(io.__proto__);
        console.log(data);
    });
});*/
//fs.writeFile(__dirname + '/logs/debug.log', io.__proto__);
