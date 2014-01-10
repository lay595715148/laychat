
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
    if('number' === typeof id)
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
Channel.prototype.setName = function(name) {
    if('string' === typeof name)
        this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
Channel.prototype.setLayer = function(layer) {
    if('object' === typeof layer && ('number' === typeof layer.id || '' === layer.id))
        this.layer = layer.id;
    else if('number' === typeof layer || '' === layer)
        this.layer = layer;
};
/**
 * 
 * @returns {ChannelSummary}
 */
Channel.prototype.toChannelSummary = function() {
    var ChannelSummary = require('./ChannelSummary');
    return new ChannelSummary(this);
};

