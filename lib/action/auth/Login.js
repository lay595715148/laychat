var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JOAction = $require('action.JOAction');
var Template = $require('template.Template');
var Prefacer = $require('prefacer.Prefacer');
var Service = $require('service.Service');
var User = $require('model.User');

/**
 * 
 */
function Login(req, res) {
    var name = $config.get('sign.action.login') || 'login';
    JOAction.call(this, name, req, res);
}

$util.inherits(Login, JOAction);

module.exports = exports = Login;

Login.prototype.dispatch = function() {
    if(this.request.method === 'POST') {
        this.post();
    } else {
        JOAction.prototype.dispatch.call(this);
    }
};
Login.prototype.launch = function() {
    var cookie = this.scope.cookie();
    this.template.template('login.jade');
    this.template.display();
};
Login.prototype.post = function() {
    var me = this;
    var uservice = Service.factory('UserService');
    var post = this.scope.post();
    var request = this.scope.request();
    var username = post.username;
    var password = post.password;
    var async = new Async();
    /**
     * 成功登录响应
     */
    var success = function() {
        me.template.redirect(request.refer?request.refer:'/');
    };
    /**
     * 用户名密码错误
     */
    var relogin = function() {
        me.template.push({error:'用户名密码错误'});
        me.template.template('login.jade');
        me.template.display();
    };
    
    async.push(uservice.readByPassword, [username, password], uservice, function(ret) {
        if($util.isA(ret, User)) {
            me.prefacer.user = ret;
            //更新seesion memcache user
            me.prefacer.update();
            
            success();
        } else {
            relogin();
        }
    });
    async.exec();
    //下面这个方法相对逻辑易懂一点
    /*uservice.readByPassword(username, password, function(ret) {
        if($util.isA(ret, User)) {
            me.template.push(Collector.response(true, 'login', {success:true}));
            me.template.json();
            var async = new Async();
            async.push(sservice.mcreate, [ret.id, ret], sservice, function(ret) {
                $logger.info($util.json(ret));
            });
            async.push(sservice.mread, [ret.id], sservice, function(ret) {
                $logger.info($util.json(ret));
            });
            async.exec(function(mcreate, mread) {
                $logger.info($util.json(mcreate), $util.json(mread));
            });
        } else {
            me.template.push(Collector.response(true, 'login', {success:false}));
            me.template.json();
        }
    });*/
};
