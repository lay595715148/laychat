var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');

/**
 * 频道对象综述对象
 */
function ChannelSummary(id, name, layer, namespace, users) {
    var _id = 0, _name = '', _layer = 0;
    
    if(Utilities.isObject(id) && !Utilities.isNull(id)) {
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
        if(Utilities.isObject(layer) && !Utilities.isNull(layer) && (Utilities.isNumber(layer.id) || '' === layer.id))
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
    this.__defineGetter__('nick', function() {
        return _layer;
    });
    
    this.id = id;//ID
    this.name = name;//名称
    this.layer = layer;//默认层
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

