/**
 * 频道对象
 */
function Channel(id, name, layer) {
    this.id = id;
    this.name = name;
    this.layer = layer;//default layer
    console.log('Channel construct');
}
module.exports = Channel;

Channel.prototype.setId = function(id) {
    this.id = id;
};
Channel.prototype.setName = function(name) {
    this.name = name;
};
Channel.prototype.setLayer = function(layer) {
    if('object' === typeof layer)
        this.layer = layer.id;
    else 
        this.layer = layer;
};
Channel.prototype.toChannelSummary = function() {
    var ChannelSummary = require('./ChannelSummary');
    var cs = new ChannelSummary();
    cs.setId(this.id);
    cs.setName(this.name);
    cs.setLayer(this.layer);
    return cs;
};

