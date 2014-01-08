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
    socket.on('enter', function(data) {
        if(checkEnterData(data)) {
            console.log(Number);
            var cs = Laychat.createChannel(data.channel, io);
            if(cs) {
                socket.emit('entered', extend(data, cs.toChannel()));
            } else {
                socket.emit('entered', extend(data, {'success':false}));
            }
        } else {
            socket.emit('entered', extend(data, {'success':false}));
        }
        console.log('do enter in channel');
    }).on('disconnect', function() {
        console.log('do disconnect in channel');
    }).on('reconnecting', function() {
        console.log('do reconnecting in channel');
    });
    
    console.log('do connect in channel');
});

function checkEnterData(data) {
    if('undefined' == typeof data.token) {
        return false;
    }
    if('undefined' == typeof data.channel || isNaN(data.channel)) {
        return false;
    }
    return true;
};
function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}
