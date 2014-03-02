var Data = require('../data/Data');

/**
 * 
 */
function ClientSummary(id, clientId, clientName, clientSecret, clientType, redirectURI, location, description, icon) {
    var _id = 0, _clientId = '', _clientName = '', _clientSecret = '', _clientType = '', _redirectURI = '', _location = '', _description = '', _icon = '';

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        clientId = tmp.clientId;
        clientName = tmp.clientName;
        clientSecret = tmp.clientSecret;
        clientType = tmp.clientType;
        redirectURI = tmp.redirectURI;
        location = tmp.location;
        description = tmp.description;
        icon = tmp.icon;
    }

    // 一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isString(id))
            _id = id;
    });
    this.__defineSetter__('clientId', function(clientId) {
        if($util.isString(clientId) || $util.isNumber(clientId))
            _clientId = clientId;
    });
    this.__defineSetter__('clientName', function(clientName) {
        if($util.isString(clientName))
            _clientName = clientName;
    });
    this.__defineSetter__('clientSecret', function(clientSecret) {
        if($util.isString(clientSecret))
            _clientSecret = clientSecret;
    });
    this.__defineSetter__('clientType', function(clientType) {
        if($util.isString(clientType))
            _clientType = clientType;
    });
    this.__defineSetter__('redirectURI', function(redirectURI) {
        if($util.isString(redirectURI))
            _redirectURI = redirectURI;
    });
    this.__defineSetter__('location', function(location) {
        if($util.isString(location))
            _location = location;
    });
    this.__defineSetter__('description', function(description) {
        if($util.isString(description))
            _description = description;
    });
    this.__defineSetter__('icon', function(icon) {
        if($util.isString(icon))
            _icon = icon;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('clientId', function() {
        return _clientId;
    });
    this.__defineGetter__('clientName', function() {
        return _clientName;
    });
    this.__defineGetter__('clientSecret', function() {
        return _clientSecret;
    });
    this.__defineGetter__('clientType', function() {
        return _clientType;
    });
    this.__defineGetter__('redirectURI', function() {
        return _redirectURI;
    });
    this.__defineGetter__('location', function() {
        return _location;
    });
    this.__defineGetter__('description', function() {
        return _description;
    });
    this.__defineGetter__('icon', function() {
        return _icon;
    });

    this.id = id;
    this.clientId = clientId;
    this.clientName = clientName;
    this.clientSecret = clientSecret;
    this.clientType = clientType;
    this.redirectURI = redirectURI;
    this.location = location;
    this.description = description;
    this.icon = icon;
}

$util.inherits(ClientSummary, Data);

module.exports = exports = ClientSummary;

ClientSummary.prototype.setId = function(id) {
    this.id = id;
};
ClientSummary.prototype.setClientId = function(clientId) {
    this.clientId = clientId;
};
ClientSummary.prototype.setClientName = function(clientName) {
    this.clientName = clientName;
};
ClientSummary.prototype.setClientSecret = function(clientSecret) {
    this.clientSecret = clientSecret;
};
ClientSummary.prototype.setClientType = function(clientType) {
    this.clientType = clientType;
};
ClientSummary.prototype.setRedirectURI = function(redirectURI) {
    this.redirectURI = redirectURI;
};
ClientSummary.prototype.setLocation = function(location) {
    this.location = location;
};
ClientSummary.prototype.setDescription = function(description) {
    this.description = description;
};
ClientSummary.prototype.setIcon = function(icon) {
    this.icon = icon;
};
ClientSummary.prototype.getId = function() {
    return this.id;
};
ClientSummary.prototype.getClientId = function() {
    return this.clientId;
};
ClientSummary.prototype.getClientName = function() {
    return this.clientName;
};
ClientSummary.prototype.getClientSecret = function() {
    return this.clientSecret;
};
ClientSummary.prototype.getClientType = function() {
    return this.clientType;
};
ClientSummary.prototype.getRedirectURI = function() {
    return this.redirectURI;
};
ClientSummary.prototype.getLocation = function() {
    return this.location;
};
ClientSummary.prototype.getDescription = function() {
    return this.description;
};
ClientSummary.prototype.getIcon = function() {
    return this.icon;
};
