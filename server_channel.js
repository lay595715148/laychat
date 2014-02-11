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
//var ChannelManager = Laychat.getChannelManager(io)

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

Laychat.openManager(app);
Laychat.openChannelManager(app, io);//
Laychat.openUserManager(app, io);//
