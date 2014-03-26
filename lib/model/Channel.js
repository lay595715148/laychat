var ChannelSummary = $require('data.ChannelSummary');
var SocketChannel = $require('entity.SocketChannel');
var SocketChannelSummary = $require('data.SocketChannelSummary');
var Model = $require('core.Model');

/**
 * 频道对象
 * @param id {Number}
 * @param name {String}
 * @param layer {Number}
 */
function Channel(id, name, layer) {
    var _id = 0, _name = '', _layer = 0;
    
    if($util.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        layer = tmp.layer;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineSetter__('layer', function(layer) {
        if($util.isObject(layer) && ($util.isNumber(layer.id) || '' === layer.id))
            _layer = layer.id;
        else if($util.isNumber(layer) || '' === layer)
            _layer = layer;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('layer', function() {
        return _layer;
    });
    
    this.id = id;
    this.name = name;
    this.layer = layer;
}

$util.inherits(Channel, Model);

module.exports = exports = Channel;


/**
 * 
 * @param id {Number}
 */
Channel.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
Channel.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
Channel.prototype.setLayer = function(layer) {
    this.layer = layer;
};
/**
 * 
 * @returns {Number}
 */
Channel.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @returns {String}
 */
Channel.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @returns {Number}
 */
Channel.prototype.getLayer = function() {
    return this.layer;
};
/**
 * 
 * @returns {ChannelSummary}
 */
Channel.prototype.toSocketChannel = function() {
    return new SocketChannel(this);
};
/**
 * 
 * @returns {ChannelSummary}
 */
Channel.prototype.toChannelSummary = function() {
    return new ChannelSummary(this);
};
/**
 * 
 * @returns {SocketChannelSummary}
 */
Channel.prototype.toSocketChannelSummary = function() {
    return new SocketChannelSummary(this);
};

Channel.table = Channel.prototype.table = function() {
    return 'lay_channel';
};
Channel.columns = Channel.prototype.columns = function() {
    return {
        'id':'_id',
        'name':'name',
        'layer':'layer'
    };
};
Channel.primary = Channel.prototype.primary = function() {
    return '_id';
};
Channel.sequence = Channel.prototype.sequence = function() {
    return '_id';
};
Channel.key = Channel.prototype.key = function() {
    return 'id';
}