var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Laychat = require('./src/cn/laysoft/laychat');
var ChannelSummary = require('./src/cn/laysoft/laychat/model/ChannelSummary');

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
    res.send('OK');
});
app.post('/authorize', function(req, res) {
    res.send('authorize OK');
});

Laychat.CreateChannel(ChannelSummary.generateById(10001), io);