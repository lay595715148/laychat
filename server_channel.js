var http = require('http');
var express = require('express');
var fs = require('fs');
var util = require('util');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var CFG = require('./lib/config/Configuration');
var Laychat = require('./lib');

server.listen(8133);

CFG.configure(function() {
    CFG.configure({
        'file': __dirname + '/config/env.json'
    });
    CFG.configure({
        'file': __dirname + '/config/main.' + CFG.get('env') + '.json',
        'dir': __dirname + '/config/' + CFG.get('env')
    });
    CFG.configure({
        'dir': __dirname + '/config/common'
    });
    console.log(CFG.get());
});

app.configure(function() {
    app.set('views', __dirname + '/template');
    app.set('view engine', 'jade');
    app.use("/css", express.static(__dirname + '/static/css'));
    app.use("/jquery", express.static(__dirname + '/static/jquery'));
    app.use("/js", express.static(__dirname + '/static/js'));
    app.use("/image", express.static(__dirname + '/static/image'));

    app.use(express.logger({stream: fs.createWriteStream(__dirname + '/logs/express.log', {flags: 'a'})}));
    //app.use(app.router);
    /*
    app.use(express.bodyParser());
    */
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret:'laychat',cookie: { maxAge: 60 * 60 * 1000 }}));
    app.use(express.static(__dirname + '/static'));
    
});
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/static/html/channel.html');
    Laychat.createChannel(io, 10000);
});
app.get('/:t', function(req, res) {
    res.sendfile(__dirname + '/static/html/channel.html');
    var channelid = /^[1-9]{1}[0-9]{4}$/.test(req.params.t)?parseInt(req.params.t):false;
    if(channelid) {
        Laychat.createChannel(io, channelid);
    } else {
        Laychat.createChannel(io, 10000);
    }
});
