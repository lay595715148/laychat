var app = require('express')();
var server = require('http').createServer(app).listen(8133);
var io = require('socket.io').listen(server);
var Laychat = require('./lib').open(app, io);
