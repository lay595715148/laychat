/**
 * 
 */
function OAuth2CodeSummary(code, userid, clientId, redirectURI, expires) {
    var _code = '', _userid = '', _clientId = '', _redirectURI = '', _expires = 0;

    if($util.isObject(code) && !$util.isNull(code)) {
        var tmp = code;
        code = tmp.code;
        userid = tmp.userid;
        clientId = tmp.clientId;
        redirectURI = tmp.redirectURI;
        expires = tmp.expires;
    }

    // 一些setter和getter方法
    this.__defineSetter__('code', function(code) {
        if($util.isString(code))
            _code = code;
    });
    this.__defineSetter__('userid', function(userid) {
        if($util.isString(userid) || $util.isNumber(userid))
            _userid = userid;
    });
    this.__defineSetter__('clientId', function(clientId) {
        if($util.isString(clientId) || $util.isNumber(clientId))
            _clientId = clientId;
    });
    this.__defineSetter__('redirectURI', function(redirectURI) {
        if($util.isString(redirectURI))
            _redirectURI = redirectURI;
    });
    this.__defineSetter__('expires', function(expires) {
        if($util.isInteger(expires))
            _expires = expires;
    });
    this.__defineGetter__('code', function() {
        return _code;
    });
    this.__defineGetter__('userid', function() {
        return _userid;
    });
    this.__defineGetter__('clientId', function() {
        return _clientId;
    });
    this.__defineGetter__('redirectURI', function() {
        return _redirectURI;
    });
    this.__defineGetter__('expires', function() {
        return _expires;
    });

    this.code = code;
    this.userid = userid;
    this.clientId = clientId;
    this.redirectURI = redirectURI;
    this.expires = expires;
}

module.exports = exports = OAuth2CodeSummary;

OAuth2CodeSummary.prototype.setCode = function(code) {
    this.code = code;
};
OAuth2CodeSummary.prototype.setUserid = function(userid) {
    this.userid = userid;
};
OAuth2CodeSummary.prototype.setClientId = function(clientId) {
    this.clientId = clientId;
};
OAuth2CodeSummary.prototype.setRedirectURI = function(redirectURI) {
    this.redirectURI = redirectURI;
};
OAuth2CodeSummary.prototype.setExpires = function(expires) {
    this.expires = expires;
};
OAuth2CodeSummary.prototype.getCode = function() {
    return this.code;
};
OAuth2CodeSummary.prototype.getUserid = function() {
    return this.userid;
};
OAuth2CodeSummary.prototype.getClientId = function() {
    return this.clientId;
};
OAuth2CodeSummary.prototype.getRedirectURI = function() {
    return this.redirectURI;
};
OAuth2CodeSummary.prototype.getExpires = function() {
    return this.expires;
};
