var Utilities = require('../util/Utilities');
var ChannelSummary = require('../data/ChannelSummary');
var ChannelSocketSummary = require('../data/ChannelSocketSummary');
var Model = require('../model/Model');

/**
 * 频道对象
 * @param id {Number}
 * @param name {String}
 * @param layer {Number}
 */
function Channel(id, name, layer) {
    var _id = 0, _name = '', _layer = 0;
    
    if(Utilities.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        layer = tmp.layer;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if(Utilities.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if(Utilities.isString(name))
            _name = name;
    });
    this.__defineSetter__('layer', function(layer) {
        if(Utilities.isObject(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
            _layer = layer.id;
        else if(Utilities.isNumber(layer) || '' === layer)
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

Utilities.inherits(Channel, Model);

module.exports = exports = Channel;


/**
 * 
 * @param id {Number}
 */
Channel.prototype.setId = function(id) {
    if(Utilities.isNumber(id))
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
Channel.prototype.setName = function(name) {
    if(Utilities.isString(name))
        this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
Channel.prototype.setLayer = function(layer) {
    if(Utilities.isObject(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
        this.layer = layer.id;
    else if(Utilities.isNumber(layer) || '' === layer)
        this.layer = layer;
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
 * @returns {ChannelSocketSummary}
 */
Channel.prototype.toChannelSocketSummary = function() {
    return new ChannelSocketSummary(this);
};

Channel.table = Channel.prototype.table = function() {
    return 'lay_channel';
};
Channel.columns = Channel.prototype.columns = function() {
    return {
        'id':'id',
        'name':'name',
        'layer':'layer'
    };
};
