var Utilities = require('../util/Utilities');
var ChannelSummary = require('../data/ChannelSummary');

/**
 * 频道对象
 * @param id {Number}
 * @param name {String}
 * @param layer {Number}
 */
function Channel(id, name, layer) {
    this.id = 0;
    this.name = '';
    this.layer = 0;
    
    if('object' === typeof id) {
        id = id.id;
        name = id.name;
        layer = id.layer;
    }
    
    this.setId(id);
    this.setName(name);
    this.setLayer(layer);
}

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

