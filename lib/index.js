var path = require('path');
var express = require('express');
var fs = require('fs');
var url = require('url');
var useragent = require('useragent');
var assert = require('assert');

//几个优先加载项
var Underscore = require('./util/Underscore');
var Utilities = require('./util/Utilities');
var Requirer = require('./util/Requirer');
var Logger = require('./util/Logger');
var Config = require('./config/Config');

var Async = $require('util.Async');

var Pool = $require('core.Pool');
var Action = $require('core.Action');
var Manager = $require('core.Manager');

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
    app.set('views', __dirname + '/../template');
    app.set('view engine', 'jade');
    app.use("/css", express.static(__dirname + '/../static/css'));
    app.use("/library", express.static(__dirname + '/../static/library'));
    app.use("/jquery", express.static(__dirname + '/../static/jquery'));
    app.use("/webix", express.static(__dirname + '/../static/webix'));
    app.use("/js", express.static(__dirname + '/../static/js'));
    app.use("/image", express.static(__dirname + '/../static/image'));
    app.use("/html", express.static(__dirname + '/../static/html'));
    app.use("/favicon.ico", express.static(__dirname + '/../static/image/favicon.ico'));
    app.use("/image/favicon.ico", express.static(__dirname + '/../static/image/favicon.ico'));

    app.use(express.logger({stream: fs.createWriteStream(__dirname + '/../logs/express.log', {flags: 'a'})}));
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.cookieSession({ secret:'laychat',cookie: { maxAge: 60 * 60 * 1000 }}));
    app.use(express.static(__dirname + '/../static'));
    
    /*var nodeVersion = process.versions.node.split('.');
    $logger.info(parseInt(nodeVersion[0], 10) === 0 && parseInt(nodeVersion[1], 10) < 10);*/
    
    // development only
    app.configure('development', function(){
        app.set('db uri', 'localhost/dev');
    });

    // production only
    app.configure('production', function(){
        app.set('db uri', 'n.n.n.n/prod');
    });

    $logger.info('This process is pid ' + process.pid);
    Laychat.openConfig(app, io);
    Laychat.openUser(app, io);//
    Laychat.openChannel(app, io);//
    Laychat.openPool(app, io);

    app.use(function(req, res, next) {
        $logger.info('This process is pid:' + process.pid);
        //var originalUrl = url.parse(req.originalUrl);
        var parsed = url.parse(req.url);
        if (parsed.auth && !parsed.protocol && ~parsed.href.indexOf('//')) {
            // This parses pathnames, and a strange pathname like //r@e should work
            parsed = url.parse(req.url.replace(/@/g, '%40'));
        }
        var path = parsed.pathname;
        var gets = $config.get('actions.get');
        var posts = $config.get('actions.post');
        var requests = $config.get('actions.request');
        var regexps = $config.get('actions.regexp');

        if ('GET' === req.method) {
            if($util.isString(gets[path])) {
                Action.instance(gets[path], req, res).run();
                return true;
            } else if($util.isString(requests[path])) {
                Action.instance(requests[path], req, res).run();
                return true;
            }
        } else if('POST' === req.method) {
            if($util.isString(posts[path])) {
                Action.instance(posts[path], req, res).run();
                return true;
            } else if($util.isString(requests[path])) {
                Action.instance(requests[path], req, res).run();
                return true;
            }
        }
        if($util.isArray(regexps)) {
            for(var i in regexps) {
                var regexp = regexps[i];
                var reg = new RegExp(regexp.reg);
                var ref = regexp.ref;
                var matchs = reg.exec(path);
                if(matchs) {
                    $logger.error(reg, ref);
                    var params = req.params = [];
                    for (var i = 1, len = matchs.length; i < len; ++i) {
                        params.push($util.isString(matchs[i]) ? decodeURIComponent(matchs[i]) : matchs[i]);
                    }
                    Action.instance(ref, req, res).run();
                    return true;
                }
            }
        }
        
        next();
    });
    
    app.get('*', function(req, res, next){
        // trigger a 404 since no other middleware
        // will match /404 after this one, and we're not
        // responding here
        res.statusCode = 404;
        res.sendfile(path.resolve(__dirname, '../static/html/', '404.html'));
    });
    
};
/**
 * 
 * @param app
 * @param io
 */
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
        //$logger.info('configuration', $util.json($config.get()));
    });
};

Laychat.openUser = function(app, io) {
    var um = Manager.instance('UserManager', io);
    Laychat._pushUserManager(um);
    um.create();
};
/**
 * 
 */
Laychat.openChannel = function(app, io) {
    var cm = Manager.instance('ChannelManager', io), channelid = 10000;
    Laychat._pushChannelManager(cm);
    cm.createChannel(channelid);
};
Laychat.openPool = function(app, io) {
    Pool.factory('SocketUserPool').load(function() {
        $logger.info('SocketUser pool is ready');
    });
    Pool.factory('MessagePool').load(function() {
        $logger.info('Message pool is ready');
    });
};
