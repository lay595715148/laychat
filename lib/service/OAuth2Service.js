var md5 = require('../util/MD5');
var User = require('../model/User');
var Store = require('../store/Store');
var Service = require('../service/Service');

function OAuth2Service() {
    this.sign = $config.get('sign.memcache.oauth2.oauth2', 'oauth2');
}

$util.inherits(OAuth2Service, Service);

module.exports = exports = OAuth2Service;

OAuth2Service.REQUEST_TYPE_CODE = 'code';
OAuth2Service.REQUEST_TYPE_POST = 'post';
OAuth2Service.REQUEST_TYPE_TOKEN = 'token';
OAuth2Service.REQUEST_TYPE_PASSWORD = 'password';
OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN = 'refresh_token';
OAuth2Service.REQUEST_TYPE_SHOW = 'show';
OAuth2Service.RESPONSE_TYPE_CODE = 'code';
OAuth2Service.RESPONSE_TYPE_TOKEN = 'token';
OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
OAuth2Service.GRANT_TYPE_PASSWORD = 'password';
OAuth2Service.GRANT_TYPE_REFRESH_TOKEN = 'refresh_token';
OAuth2Service.CLIENT_TYPE_WEB = 'webApp';
OAuth2Service.CLIENT_TYPE_DESKTOP = 'desktopApp';
OAuth2Service.CLIENT_TYPE_JS = 'jsApp';
OAuth2Service.TOKEN_TYPE_ACCESS = 1;
OAuth2Service.TOKEN_TYPE_REFRESH = 2;
OAuth2Service.prototype.getRequestType = function(scope) {
    var request = scope.request();
    var request_type, grant_type;
    
    if($util.isUndefined(request.grant_type)) {
        grant_type = OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE;
    } else {
        grant_type = request.grant_type;
    }
    switch(grant_type) {
        case OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE:
            request_type = OAuth2Service.REQUEST_TYPE_TOKEN;
            break;
        case OAuth2Service.GRANT_TYPE_PASSWORD:
            request_type = OAuth2Service.REQUEST_TYPE_PASSWORD;
            break;
        case OAuth2Service.GRANT_TYPE_REFRESH_TOKEN:
            request_type = OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN;
            break;
        default:
            grant_type  = OAuth2Service.GRANT_TYPE_AUTHORIZATION_CODE;
            request_type = OAuth2Service.REQUEST_TYPE_TOKEN;
            break;
    }
    return request_type;
};
OAuth2Service.prototype.checkRequest = function(scope, request_type) {
    var ret = true;
    var get = scope.get(), post = scope.post(), user = scope.user();
    request_type = request_type || OAuth2Service.REQUEST_TYPE_CODE;
    
    switch(request_type) {
        case OAuth2Service.REQUEST_TYPE_CODE:
            if($util.isUndefined(get.client_id) || $util.isUndefined(get.redirect_uri)) {
                ret = false;
            } else if($util.isDefined(get.response_type) && get.response_type != 'code' 
                && get.response_type != 'token') {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_POST:
            //登录会话用户没有存在session里
            if($util.isUndefined(get.client_id) || $util.isUndefined(get.redirect_uri)
                || (($util.isUndefined(post.username) || $util.isUndefined(post.password)) 
                && (!user.id || !user.name))) {
                ret = false;
            } else if($util.isDefined(get.response_type) && get.response_type != 'code' 
                && get.response_type != 'token') {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_TOKEN:
            if($util.isUndefined(post.client_id) || $util.isUndefined(post.redirect_uri)
                || $util.isUndefined(post.client_secret) || $util.isUndefined(post.code)) {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_PASSWORD:
            if($util.isUndefined(post.client_id) || $util.isUndefined(post.client_secret)
                || $util.isUndefined(post.grant_type) || $util.isUndefined(post.username)
                || $util.isUndefined(post.password)) {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_REFRESH_TOKEN:
            if($util.isUndefined(post.client_id) || $util.isUndefined(post.client_secret)
                || $util.isUndefined(post.grant_type) || $util.isUndefined(post.refresh_token)) {
                ret = false;
            }
            break;
        case OAuth2Service.REQUEST_TYPE_SHOW:
            if($util.isUndefined(post.access_token) || $util.isUndefined(post.userid)) {
                ret = false;
            }
            break;
        default:
            ret = false;
            break;
    }
    return ret;
};
