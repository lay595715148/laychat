var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JUAction = require('../action/JUAction');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');
var Service = require('../service/Service');
var Client = require('../model/Client');

function Authorize(req, res) {
    var name = $config.get('sign.action.authorize') || 'authorize';
    JUAction.call(this, name, req, res);
}

$util.inherits(Authorize, JUAction);

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
    var suser = this.prefacer.user;//session memecache user
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
                me.template.push({user:suser});
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
    var codeservice = Service.factory('OAuth2CodeService');
    var tservice = Service.factory('OAuth2TokenService');
    var sessid = $config.get('sign.cookie.session') || 'sid';
    var scope = this.scope;
    var use_refresh_token = $config.get('oauth2.use_refresh_token')?true:false;
    var get = scope.get(), post = scope.post(), request = scope.request(), session = scope.session();
    var suser = this.prefacer.user;//session memecache user
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
     * 用户名密码错误
     */
    var relogin = function() {
        me.template.push({error:'用户名密码错误'});
        me.template.push({login_type:'authorize', title:'Authorize',response_type:response_type, client_id:clientId, redirect_uri:redirectURI});
        me.template.template('login.jade');
        me.template.display();
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
                success(redirectURI + '#userid=' + suser.id + '&token=' + encodeURIComponent(token.token) + '&expires=' + token.expires + '&refresh_token=' + encodeURIComponent(rtoken.token) + '&refresh_expires=' + rtoken.expires);
            } else {
                var token = result;
                success(redirectURI + '#userid=' + suser.id + '&token=' + encodeURIComponent(token.token) + '&expires=' + token.expires);
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
            suser = me.prefacer.user = ret;
            //suser.id = ret.id;
            //suser.name = ret.name;
            if(response_type == 'token') {
                //打开生成token任务
                async.push(tservice.gen, [clientId, suser.id, use_refresh_token], tservice, genToken);
            } else {
                //打开生成code任务
                async.push(codeservice.gen, [clientId, suser.id, redirectURI], codeservice, genCode);
            }
            //更新seesion memcache user
            me.prefacer.update();
        } else {
            relogin();
        }
    };
    /**
     * 检测登录客户端回调函数
     */
    var checkClient = function(ret) {
        if(ret && suser && suser.id && suser.name) {
            if(response_type == 'token') {
                //打开生成token任务
                async.push(tservice.gen, [clientId, suser.id, use_refresh_token], tservice, genToken);
            } else {
                //打开生成code任务
                async.push(codeservice.gen, [clientId, suser.id, redirectURI], codeservice, genCode);
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
    /**
     * 检测使用其他账号登录
     */
    var other = !$util.isEmpty(request.otherlogin);
    var register = !$util.isEmpty(request.register);

    if(other) {
        //清除seesion memcache user
        me.prefacer.remove();
        //清除cookie
        me.response.clearCookie(sessid);
        //跳转至认证页
        success($config.get('urls.oauth2.authorize') + '?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(redirectURI) + '&response_type=' + response_type);
    } else if(register) {
        //跳转至注册页
        success($config.get('urls.register'));
    } else if(checked) {
        //打开检测登录客户端任务
        async.push(cservice.checkClient, args, cservice, checkClient);
        async.exec();
    } else {
        failure('invalid_request');
    }
};
