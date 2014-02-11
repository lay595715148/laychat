var path = require('path');
var Collector = require('./util/Collector');
var Utilities = require('./util/Utilities');
var Validater = require('./util/Validater');
var ChannelManager = require('./manager/ChannelManager');
var UserManager = require('./manager/UserManager');

function Laychat() {

}

module.exports = exports = Laychat;

/**
 * @api private
 */
Laychat._managers = {};
/**
 * @param {ChannelManager} cm
 * @api private
 */
Laychat._pushChannelManager = function(cm) {
    var cms = Laychat._managers.cms = Laychat._managers.cms || [];
    cms[cms.length] = cm;
};
/**
 * @param {UserManager} um
 * @api private
 */
Laychat._pushUserManager = function(um) {
    var ums = Laychat._managers.ums = Laychat._managers.ums || [];
    ums[ums.length] = um;
};

/**
 * 
 * @param {Object} app express
 */
Laychat.openManager = function(app, io) {
    app.get('/manager', function(req, res) {
        // path.resolve(),fixed forbidden error
        res.sendfile(path.resolve(__dirname, '../static/html/', 'channel.html'));
    });
    app.get('/manager/:p', function(req, res) {
        // path.resolve(),fixed forbidden error
        res.sendfile(path.resolve(__dirname, '../static/html/', 'channel.html'));
    });
};

/**
 * 
 */
Laychat.openChannelManager = function(app, io) {
    var cm = new ChannelManager(io), channelid = 10000;

    Laychat._pushChannelManager(cm);
    
    app.get('/', function(req, res) {
        // path.resolve(),fixed forbidden error
        res.sendfile(path.resolve(__dirname, '../static/html/', 'channel.html'));
    });
    app.get('/:p', function(req, res) {
        res.sendfile(path.resolve(__dirname, '../static/html/', 'channel.html'));
        channelid = /^[1-9]{1}[0-9]{4}$/.test(req.params.p) ? parseInt(req.params.p) : 10000;
        //cm.createChannel(channelid);
    });
    app.get('/remove/:p', function(req, res) {
        cm.removeChannel(channelid);
        res.send('OK');
    });

    cm.createChannel(channelid);
};

Laychat.openUserManager = function(app, io) {
    
};

/* Laychat.Layfig = require('./layfig'); */
Laychat.Collector = Collector;
Laychat.Utilities = Utilities;
Laychat.Validater = Validater;
