var Channel = require('./Channel');

/**
 * 频道对象综述对象
 */
function ChannelSummary() {
    this.id = 0;
    this.name = '';
    this.layer = 0;//默认层
    this.socket = null;
    console.log('ChannelSummary construct');
}

ChannelSummary.prototype.setId = function(id) {
    this.id = id;
};
ChannelSummary.prototype.setName = function(name) {
    this.name = name;
};
ChannelSummary.prototype.setLayer = function(layer) {
    if('object' === typeof layer)
        this.layer = layer.id;
    else 
        this.layer = layer;
};
ChannelSummary.prototype.setSocket = function(socket) {
    this.socket = socket;
};
/**
 * 通过频道ID生成频道对象
 * @param id
 * @param token
 * @returns {Channel}
 */
ChannelSummary.generateById = function(id) {
    console.log('do ChannelSummary');
    var cs = new ChannelSummary();
    // TODO
    cs.setId(id);
    cs.setName('global');
    cs.setLayer(Math.floor(Math.random() * 1000));
    return cs;
};
ChannelSummary.prototype.toChannel = function() {
    var c = new Channel();
    c.setId(this.id);
    c.setName(this.name);
    c.setLayer(this.layer);
    return c;
};

module.exports = ChannelSummary;
