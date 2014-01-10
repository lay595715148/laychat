
/**
 * 频道对象综述对象
 */
function ChannelSummary(id, name, layer, namespace) {
    this.id = 0;
    this.name = '';
    this.layer = 0;//默认层
    this.namespace = '';
    
    if('object' === typeof id) {
        id = id.id;
        name = id.name;
        layer = id.layer;
        namespace = id.namespace;
    }
    
    this.setId(id);
    this.setName(name);
    this.setLayer(layer);
    this.setNamespace(namespace);
}

module.exports = exports = ChannelSummary;

/**
 * 
 * @param id {Number}
 */
ChannelSummary.prototype.setId = function(id) {
    if('number' === typeof id)
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
ChannelSummary.prototype.setName = function(name) {
    if('string' === typeof name)
        this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
ChannelSummary.prototype.setLayer = function(layer) {
    if('object' === typeof layer && ('number' === typeof layer.id || '' === layer.id))
        this.layer = layer.id;
    else if('number' === typeof layer || '' === layer)
        this.layer = layer;
};
/**
 * 
 * @param namespace {String}
 */
ChannelSummary.prototype.setNamespace = function(namespace) {
    if('string' === typeof namespace)
        this.namespace = namespace;
    //else if('number' === typeof namespace)
    //    this.namespace = namespace.toString();
};
ChannelSummary.prototype.toChannel = function() {
    var Channel = require('./Channel');
    return new Channel(this);
};
/**
 * 通过频道ID生成频道对象
 * @param id
 * @param token
 * @returns {ChannelSummary}
 */
ChannelSummary.generateById = function(id) {
    var cs = new ChannelSummary();
    cs.setId(id);
    cs.setName('global');
    cs.setLayer(Math.floor(Math.random() * 1000));
    return cs;
};

