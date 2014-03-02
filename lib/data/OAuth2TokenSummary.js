var Data = require('../data/Data');

/**
 * 
 */
function OAuth2TokenSummary(token, userid, clientId, type, expires) {
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
        if($util.isString(type))
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

$util.inherits(OAuth2TokenSummary, Data);

module.exports = exports = OAuth2TokenSummary;

OAuth2TokenSummary.prototype.setToken = function(token) {
    this.token = token;
};
OAuth2TokenSummary.prototype.setUserid = function(userid) {
    this.userid = userid;
};
OAuth2TokenSummary.prototype.setClientId = function(clientId) {
    this.clientId = clientId;
};
OAuth2TokenSummary.prototype.setType = function(type) {
    this.type = type;
};
OAuth2TokenSummary.prototype.setExpires = function(expires) {
    this.expires = expires;
};
OAuth2TokenSummary.prototype.getToken = function() {
    return this.token;
};
OAuth2TokenSummary.prototype.getUserid = function() {
    return this.userid;
};
OAuth2TokenSummary.prototype.getClientId = function() {
    return this.clientId;
};
OAuth2TokenSummary.prototype.getType = function() {
    return this.type;
};
OAuth2TokenSummary.prototype.getExpires = function() {
    return this.expires;
};
