var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JOAction = require('../action/JOAction');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');
var Service = require('../service/Service');
var Client = require('../model/Client');

function Authorize(req, res) {
    var name = $config.get('sign.action.authorize') || 'authorize';
    JOAction.call(this, name, req, res);
}

$util.inherits(Authorize, JOAction);

module.exports = exports = Authorize;

Authorize.prototype.dispatch = function() {
    if(this.request.method === 'POST') {
        this.submit();
    } else {
        this.launch();
    }
};
Authorize.prototype.launch = function() {
    var me = this;
    var oservice = Service.factory('OAuth2Service');
    var cservice = Service.factory('ClientService');
    var scope = this.scope;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session();
    var response_type = request.response_type || 'code';
    var checked = oservice.checkRequest(get, post, request);
    var clientId = get.client_id;
    var redirectURI = get.redirect_uri;
    var clientType = response_type == 'token'?3:1;
    if(checked) {
        var async = new Async();
        var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
        async.push(cservice.checkClient, args, cservice, function(ret) {
            if(ret) {
                me.template.push({title:'Authorize',response_type:response_type, client_id:get.client_id, redirect_uri:get.redirect_uri});
                me.template.template('login.jade');
                me.template.display();
            } else {
                me.template.push(Collector.response(false, me.name, 'invalid_client'));
                me.template.json();
            }
        });
        async.exec();
    } else {
        me.template.push(Collector.response(false, me.name, 'invalid_request'));
        me.template.json();
    }
};
Authorize.prototype.submit = function() {
    var me = this;
    var oservice = Service.factory('OAuth2Service');
    var cservice = Service.factory('ClientService');
    var uservice = Service.factory('UserService');
    var codeservice = Service.factory('CodeService');
    var tservice = Service.factory('TokenService');
    var scope = this.scope;
    var use_refresh_token = $config.get('use_refresh_token')?true:false;
    var access_token_lifetime = $config.get('access_token_lifetime') || 1800;
    var refresh_token_lifetime = $config.get('refresh_token_lifetime') || 86400;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session();
    var response_type = request.response_type || 'code';
    var checked = oservice.checkRequest(get, post, request);
    if(checked) {
        var async = new Async();
        var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
        /**
         * 生成code回调函数
         */
        var genCode = function(code) {
            if(code) {
                me.template.header('Status', 302);
                me.template.header('Location:' + redirectURI + '?code=' + encodeURIComponent(code));
                me.template.display();
            } else {
                me.template.push(Collector.response(false, me.name, 'invalid_grant'));
                me.template.json();
            }
        };
        /**
         * 生成token回调函数
         */
        var genToken = function(result) {
            if(result) {
                if(use_refresh_token) {
                    var token = result[0];
                    var rtoken = result[1];
                    me.template.header('Status', 302);
                    me.template.header('Location', client['redirectURI'] + '#userid=' + session.userid + '&token=' + encodeURIComponent(token) + '&expires=' + access_token_lifetime + '&refresh_token=' + encodeURIComponent(rtoken) + '&refresh_expires=' + refresh_token_lifetime);
                } else {
                    var token = result;
                    me.template.header('Status', 302);
                    me.template.header('Location', client['redirectURI'] + '#userid=' + session.userid + '&token=' + encodeURIComponent(token) + '&expires=' + access_token_lifetime);
                }
                me.template.display();
            } else {
                me.template.push(Collector.response(false, me.name, 'invalid_token'));
                me.template.json();
            }
        };
        /**
         * 检测登录的用户回调函数
         */
        var checkUser = function(ret) {
            if(ret) {
                session.userid = ret.id;
                session.username = ret.name;
                if(response_type == 'token') {
                    //打开生成token任务
                    async.push(tservice.gen, [clientId, session.userid, use_refresh_token], tservice, genToken);
                } else {
                    //打开生成code任务
                    async.push(codeservice.gen, [clientId, redirectURI, session.userid], codeservice, genCode);
                }
            } else {
                me.template.push(Collector.response(false, me.name, 'invalid_user'));
                me.template.json();
            }
        };
        /**
         * 检测登录客户端回调函数
         */
        var checkClient = function(ret) {
            if(ret && session.userid && session.username) {
                if(response_type == 'token') {
                    //打开生成token任务
                    async.push(tservice.gen, [clientId, session.userid, use_refresh_token], tservice, genToken);
                } else {
                    //打开生成code任务
                    async.push(codeservice.gen, [clientId, redirectURI, session.userid], codeservice, genCode);
                }
            } else if(ret) {
                async.push(uservice.checkUser, [post.username, post.password], uservice, checkUser);
            } else {
                me.template.push(Collector.response(false, me.name, 'invalid_client'));
                me.template.json();
            }
        };
        //进一步检测参数
        if($util.isUndefined(post.username) || $util.isUndefined(post.password) || !session.userid || !session.username) {
            me.template.push(Collector.response(false, me.name, 'invalid_request'));
            me.template.json();
        } else {
            //打开检测登录客户端任务
            async.push(cservice.checkClient, args, cservice, checkClient);
            async.exec();
        }
    } else {
        me.template.push(Collector.response(false, me.name, 'invalid_request'));
        me.template.json();
    }
};
