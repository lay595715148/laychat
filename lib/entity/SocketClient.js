var Entity = $require('core.Entity');
var Collector = $require('util.Collector');

/**
 * 
 */
function SocketClient(id, clientId, clientName, clientSecret, clientType, redirectURI, location, description, icon) {
    var _id = 0, _clientId = '', _clientName = '', _clientSecret = '', _clientType = 0, _redirectURI = '', _location = '', _description = '', _icon = '';

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
        if($util.isInteger(id))
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
        if($util.isNumber(clientType))
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

$util.inherits(SocketClient, Entity);

module.exports = exports = SocketClient;

SocketClient.prototype.setId = function(id) {
    this.id = id;
};
SocketClient.prototype.setSocketClientId = function(clientId) {
    this.clientId = clientId;
};
SocketClient.prototype.setSocketClientName = function(clientName) {
    this.clientName = clientName;
};
SocketClient.prototype.setSocketClientSecret = function(clientSecret) {
    this.clientSecret = clientSecret;
};
SocketClient.prototype.setSocketClientType = function(clientType) {
    this.clientType = clientType;
};
SocketClient.prototype.setRedirectURI = function(redirectURI) {
    this.redirectURI = redirectURI;
};
SocketClient.prototype.setLocation = function(location) {
    this.location = location;
};
SocketClient.prototype.setDescription = function(description) {
    this.description = description;
};
SocketClient.prototype.setIcon = function(icon) {
    this.icon = icon;
};
SocketClient.prototype.getId = function() {
    return this.id;
};
SocketClient.prototype.getSocketClientId = function() {
    return this.clientId;
};
SocketClient.prototype.getSocketClientName = function() {
    return this.clientName;
};
SocketClient.prototype.getSocketClientSecret = function() {
    return this.clientSecret;
};
SocketClient.prototype.getSocketClientType = function() {
    return this.clientType;
};
SocketClient.prototype.getRedirectURI = function() {
    return this.redirectURI;
};
SocketClient.prototype.getLocation = function() {
    return this.location;
};
SocketClient.prototype.getDescription = function() {
    return this.description;
};
SocketClient.prototype.getIcon = function() {
    return this.icon;
};

/**
 * 主键属性名
 * @abstract
 */
SocketClient.key = SocketClient.prototype.key = function() {
    return 'id';
};
