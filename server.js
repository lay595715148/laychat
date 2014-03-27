var Requirer = require('./lib/util/Requirer');
var cluster = $.util.SimpleCluster.start();
 
//sorry for not having just cluster.isMaster
if (cluster.cluster.isMaster) {
    //do master stuff if anything at all
    //return;
    var app = $('express')();
    var server = $('http').createServer(app).listen(8133);
    var io = $('socket.io').listen(server);
    var Laychat = $.index.open(app, io);
}
