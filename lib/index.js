var path = require('path');
var express = require('express');
var fs = require('fs');
var Collector = require('./util/Collector');
var Utilities = require('./util/Utilities');
var Validater = require('./util/Validater');
var Logger = require('./util/Logger');
var Configuration = require('./config/Configuration');
var ChannelManager = require('./manager/ChannelManager');
var UserManager = require('./manager/UserManager');
var MD5 = require('./util/MD5');
var Async = require('./util/Async');

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

Laychat.open = function(app, io) {
    app.configure(function() {
        app.set('views', __dirname + '/../template');
        app.set('view engine', 'jade');
        app.use("/css", express.static(__dirname + '/../static/css'));
        app.use("/jquery", express.static(__dirname + '/../static/jquery'));
        app.use("/js", express.static(__dirname + '/../static/js'));
        app.use("/image", express.static(__dirname + '/../static/image'));
        app.use("/html", express.static(__dirname + '/../static/html'));

        app.use(express.logger({stream: fs.createWriteStream(__dirname + '/../logs/express.log', {flags: 'a'})}));
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.cookieSession({ secret:'laychat',cookie: { maxAge: 60 * 60 * 1000 }}));
        app.use(express.static(__dirname + '/../static'));
        
    });
    // development only
    app.configure('development', function(){
        app.set('db uri', 'localhost/dev');
    });

    // production only
    app.configure('production', function(){
        app.set('db uri', 'n.n.n.n/prod');
    });

    Laychat.openConfig(app, io);
    Laychat.openChannelManager(app, io);//
    Laychat.openUserManager(app, io);//
    Laychat.openAdminManager(app, io);
    
    app.get('*', function(req, res, next){
        // trigger a 404 since no other middleware
        // will match /404 after this one, and we're not
        // responding here
        res.sendfile(path.resolve(__dirname, '../static/html/', '404.html'));
    });
    return Laychat;
};
Laychat.openConfig = function(app, io) {
    $config.configure(function() {
        $config.configure({
            'file': __dirname + '/../config/env.json'
        });
        $config.configure({
            'dir': __dirname + '/../config/common'
        });
        $config.configure({
            'file': __dirname + '/../config/main.' + $config.get('env') + '.json',
            'dir': __dirname + '/../config/' + $config.get('env')
        });
        $logger.info('configuration', toString($config.get()));
    });
};
/**
 * 
 * @param {Object} app express
 */
Laychat.openAdminManager = function(app, io) {
    app.get('/manager', function(req, res) {
        // path.resolve(),fixed forbidden error
        //res.sendfile(path.resolve(__dirname, '../static/template/', 'channel.html'));
        res.send('manager ok');
        var Mongo = require('./store/Mongo');
        var User = require('./model/User');
        var user = new User();
        try {
            var mongo = new Mongo(user, $config.get('servers.mongodb.master'));
            mongo.select('*', {'name':'lay2014','pass':MD5('yuiopas')}, {}, function(ret) {
                $logger.info('result', ret);
            });
        } catch(e) {
            //
            $logger.error(e);
        }
    });
    app.get('/manager/user', function(req, res) {
        // path.resolve(),fixed forbidden error
        //res.sendfile(path.resolve(__dirname, '../static/template/', 'channel.html'));
        res.send('manager user ok');
        var async = new Async();
        function A() {
        };
        A.prototype.m = function(ret, fn) {
            var r = {'ret':ret,'a':true};
            $logger.error('fna',r);
            fn(r);
        };
        function B() {
        }
        B.prototype.m = function(ret, fn) {
            var r = {'ret':ret,'b':true};
            $logger.error('fnb',r);
            fn(r);
        };
        function C() {
        }
        C.prototype.m = function(ret, fn) {
            var r = {'ret':ret,'c':true};
            var e = ['c',true];
            $logger.error('fnc',r);
            fn(r, e);
        };
        var a = new A();
        var b = new B();
        var c = new C();
        async.push(a, a.m, [{'testa':'a'}], function() {
            $logger.error('a', toArray(arguments));
        });
        async.push(b, b.m, [{'testa':'b'}], function() {
            $logger.error('b', toArray(arguments)); 
        });
        async.push(c, c.m, [{'testa':'c'}], function() {
            $logger.error('c', toArray(arguments));
        });
        async.exec(function() {
            $logger.error('arguments', toString(toArray(arguments)));
        });
    });
    app.get('/manager/channel', function(req, res) {
        // path.resolve(),fixed forbidden error
        //res.sendfile(path.resolve(__dirname, '../static/template/', 'channel.html'));
        res.send('manager channel ok');
    });
};

/**
 * 
 */
Laychat.openChannelManager = function(app, io) {
    var cm = new ChannelManager(io), channelid = 10000, cid = 0;

    Laychat._pushChannelManager(cm);

    /**
     * @param {HTTPRequest} req The request object
     * @param {HTTPResponse} res The response object
     */
    app.get('/', function(req, res) {
        // path.resolve(),fixed forbidden error
        res.sendfile(path.resolve(__dirname, '../static/template/', 'channel.html'));
    });
    app.get(/^\/([1-9]{1}[0-9]{4})$/, function(req, res) {
        cid = req.params[0];console.log('createChannel', cid);
        cm.createChannel(cid);
        res.sendfile(path.resolve(__dirname, '../static/template/', 'channel.html'));
    });
    app.get(/^\/c\/([1-9]{1,}[0-9]{0,})$/, function(req, res) {
        // path.resolve(),fixed forbidden error
        //res.sendfile(path.resolve(__dirname, '../static/template/', 'channel.html'));
        res.send('cid:' + req.params[0]);
    });
    app.get('/remove', function(req, res) {
        //cid = req.params[0];
        cm.removeChannel(channelid);
        res.send('remove ok');
    });

    cm.createChannel(channelid);
};

Laychat.openUserManager = function(app, io) {
    var um = new UserManager(io);
    
    Laychat._pushUserManager(um);
    
    app.get(/^\/\u\/([1-9]{1,}[0-9]{0,})$/, function(req, res) {
        // path.resolve(),fixed forbidden error
        //res.sendfile(path.resolve(__dirname, '../static/template/', 'channel.html'));
        res.send('uid:' + req.params[0]);
    });
    app.get('/register', function(req, res) {
        
    });
};

