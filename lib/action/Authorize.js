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
    var checked = oservice.checkRequest(scope);
    var clientId = get.client_id;
    var redirectURI = get.redirect_uri;
    var clientType = response_type == 'token'?3:1;
    if(checked) {
        var async = new Async();
        var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
        async.push(cservice.checkClient, args, cservice, function(ret) {
            if(ret) {
                me.template.push({session:session});
                me.template.push({login_type:'authorize', title:'Authorize',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
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
    var use_refresh_token = $config.get('oauth2.use_refresh_token')?true:false;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session();
    var response_type = request.response_type || 'code';
    var request_type = 'post';
    var clientId = request.client_id;
    var redirectURI = request.redirect_uri;
    var clientType = response_type == 'token'?3:1;
    var args = [{ clientId:clientId, clientType:clientType, redirectURI:redirectURI }];
    var async = new Async();
    /**
     * 失败响应
     */
    var failure = function(msg) {
        me.template.push(Collector.response(false, me.name, msg));
        me.template.json();
    };
    /**
     * 成功重定向响应
     */
    var success = function(url) {
        me.template.redirect(url);
    };
    /**
     * 生成code回调函数
     */
    var genCode = function(code) {
        if(code) {
            success(redirectURI + '?code=' + encodeURIComponent(code.code));
        } else {
            failure('invalid_grant');
        }
    };
    /**
     * 生成token回调函数
     */
    var genToken = function(result) {
        if(result) {
            //返回OAuth2Token对象或OAuth2Token对象数组
            if(use_refresh_token) {
                var token = result[0];
                var rtoken = result[1];
                success(redirectURI + '#userid=' + session.userid + '&token=' + encodeURIComponent(token.token) + '&expires=' + token.expires + '&refresh_token=' + encodeURIComponent(rtoken.token) + '&refresh_expires=' + rtoken.expires);
            } else {
                var token = result;
                success(redirectURI + '#userid=' + session.userid + '&token=' + encodeURIComponent(token.token) + '&expires=' + token.expires);
            }
        } else {
            failure('invalid_token');
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
                async.push(codeservice.gen, [clientId, session.userid, redirectURI], codeservice, genCode);
            }
        } else {
            failure('invalid_user');
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
                async.push(codeservice.gen, [clientId, session.userid, redirectURI], codeservice, genCode);
            }
        } else if(ret) {
            //打开检测 登录用户任务
            async.push(uservice.checkUser, [post.username, post.password], uservice, checkUser);
        } else {
            failure('invalid_client');
        }
    };
    /**
     * 检测请求参数
     */
    var checked = oservice.checkRequest(scope, request_type);

    if(checked) {
        //打开检测登录客户端任务
        async.push(cservice.checkClient, args, cservice, checkClient);
        async.exec();
    } else {
        failure('invalid_request');
    }
};
