var Model = require('../model/Model');

/**
 * 
 */
function OAuth2Token(token, userid, clientId, type, expires) {
    var _token = '', _userid = '', _clientId = '', _type = '', _expires = 0;

    if($util.isObject(token) && !$util.isNull(token)) {
        var tmp = token;
        token = tmp.token;
        userid = tmp.userid;
        clientId = tmp.clientId;
        type = tmp.type;
        expires = tmp.expires;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('token', function(token) {
        if($util.isString(token))
            _token = token;
    });
    this.__defineSetter__('userid', function(userid) {
        if($util.isString(userid) || $util.isNumber(userid))
            _userid = userid;
    });
    this.__defineSetter__('clientId', function(clientId) {
        if($util.isString(clientId) || $util.isNumber(clientId))
            _clientId = clientId;
    });
    this.__defineSetter__('type', function(type) {
        if($util.isInteger(type))
            _type = type;
    });
    this.__defineSetter__('expires', function(expires) {
        if($util.isInteger(expires))
            _expires = expires;
    });
    this.__defineGetter__('token', function() {
        return _token;
    });
    this.__defineGetter__('userid', function() {
        return _userid;
    });
    this.__defineGetter__('clientId', function() {
        return _clientId;
    });
    this.__defineGetter__('type', function() {
        return _type;
    });
    this.__defineGetter__('expires', function() {
        return _expires;
    });

    this.token = token;
    this.userid = userid;
    this.clientId = clientId;
    this.type = type;
    this.expires = expires;
}

$util.inherits(OAuth2Token, Model);

module.exports = exports = OAuth2Token;

OAuth2Token.prototype.setToken = function(token) {
    this.token = token;
};
OAuth2Token.prototype.setUserid = function(userid) {
    this.userid = userid;
};
OAuth2Token.prototype.setClientId = function(clientId) {
    this.clientId = clientId;
};
OAuth2Token.prototype.setType = function(type) {
    this.type = type;
};
OAuth2Token.prototype.setExpires = function(expires) {
    this.expires = expires;
};
OAuth2Token.prototype.getToken = function() {
    return this.token;
};
OAuth2Token.prototype.getUserid = function() {
    return this.userid;
};
OAuth2Token.prototype.getClientId = function() {
    return this.clientId;
};
OAuth2Token.prototype.getType = function() {
    return this.type;
};
OAuth2Token.prototype.getExpires = function() {
    return this.expires;
};

OAuth2Token.table = OAuth2Token.prototype.table = function() {
    return 'lay_oauth2_token';
};
OAuth2Token.columns = OAuth2Token.prototype.columns = function() {
    return {
        'token' : '_id',
        'userid' : 'userid',
        'clientId' : 'clientId',
        'type' : 'type',
        'expires' : 'expires'
    };
};
