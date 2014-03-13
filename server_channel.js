var cluster = require('./lib/util/SimpleCluster').start();
 
//sorry for not having just cluster.isMaster
if (cluster.cluster.isMaster) {
    //do master stuff if anything at all
    //return;
    var app = require('express')();
    var server = require('http').createServer(app).listen(8133);
    var io = require('socket.io').listen(server);
    var Laychat = require('./lib').open(app, io);
}
