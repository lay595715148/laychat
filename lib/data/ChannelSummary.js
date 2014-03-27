var Collector = $.util.Collector;

/**
 * 频道对象综述对象
 */
function ChannelSummary(id, name, layer, namespace, users) {
    var _id = 0, _name = '', _layer = 0;
    
    if($util.isObject(id) && !$util.isNull(id)) {
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
        if($util.isObject(layer) && !$util.isNull(layer) && ($util.isNumber(layer.id) || '' === layer.id))
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
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
ChannelSummary.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param layer {Number}
 */
ChannelSummary.prototype.setLayer = function(layer) {
    this.layer = layer;
};
ChannelSummary.prototype.getId = function() {
    return this.id;
};
ChannelSummary.prototype.getName = function() {
    return this.name;
};
ChannelSummary.prototype.getLayer = function() {
    return this.layer;
};

/**
 * 转换为简单的Channel对象
 * @returns {Channel}
 */
ChannelSummary.prototype.toChannel = function() {
    var Channel = $.model.Channel;
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
    if($util.isArray(list)) {
        list.forEach(function(item) {
            if($util.isA(item, ChannelSummary)) {
                cses.push(item);
            }
        });
    }
    return Collector.list(cses, $util.isNumber(total)?total:cses.length, $util.isBoolean(hasNext)?hasNext:false);
};
