var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');

/**
 * 频道对象综述对象
 */
function ChannelSummary(id, name, layer, namespace, users) {
    this.id = 0;
    this.name = '';
    this.layer = 0;//默认层
    
    if(Utilities.isObject(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        layer = tmp.layer;
    }
    
    this.setId(id);
    this.setName(name);
    this.setLayer(layer);
}

module.exports = exports = ChannelSummary;

/**
 * 
 * @param id {Number}
 */
ChannelSummary.prototype.setId = function(id) {
    if(Utilities.isNumber(id))
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
ChannelSummary.prototype.setName = function(name) {
    if(Utilities.isString(name))
        this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
ChannelSummary.prototype.setLayer = function(layer) {
    if(Utilities.isObject(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
        this.layer = layer.id;
    else if(Utilities.isNumber(layer) || '' === layer)
        this.layer = layer;
};
/**
 * 转换为简单的Channel对象
 * @returns {Channel}
 */
ChannelSummary.prototype.toChannel = function() {
    var Channel = require('../model/Channel');
    return new Channel(this);
};

/**
 * 
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 * @returns {Object}
 */
ChannelSummary.list = function(list, total, hasNext) {
    var cses = [];
    if(Utilities.isArray(list)) {
        list.forEach(function(item) {
            if(Utilities.isA(item, ChannelSummary)) {
                cses.push(item);
            }
        });
    }
    return Collector.list(cses, Utilities.isNumber(total)?total:cses.length, Utilities.isBoolean(hasNext)?hasNext:false);
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

