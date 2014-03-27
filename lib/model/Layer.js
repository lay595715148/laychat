var Model = $.core.Model;

/**
 * 频道层对象
 * 
 * @param id
 *            {Number}
 * @param name
 *            {String}
 */
function Layer(id, name, channel) {
    var _id = 0, _name = '', _channel = 0;

    if($util.isObject(id) && !$util.isEmpty(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
        channel = tmp.channel;
    }

    // 一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineSetter__('channel', function(channel) {
        if($util.isObject(channel) && $util.isNumber(channel.id))
            _channel = channel.id;
        else if($util.isNumber(layer))
            _channel = channel;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    this.__defineGetter__('channel', function() {
        return _channel;
    });

    this.id = id;
    this.name = name;
    this.channel = channel;
}

$util.inherits(Layer, Model);

module.exports = exports = Layer;

/**
 * 
 * @param id
 *            {Number}
 */
Layer.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name
 *            {String}
 */
Layer.prototype.setName = function(name) {
    this.name = name;
};
/**
 * 
 * @param name
 *            {Number}
 */
Layer.prototype.setChannel = function(channel) {
    this.channel = channel;
};
/**
 * 
 * @returns {Number}
 */
Layer.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @returns {String}
 */
Layer.prototype.getName = function() {
    return this.name;
};
/**
 * 
 * @returns {Number}
 */
Layer.prototype.getChannel = function() {
    return this.channel;
};

Layer.table = Layer.prototype.table = function() {
    return 'lay_layer';
};
Layer.columns = Layer.prototype.columns = function() {
    return {
        'id' : 'id',
        'name' : 'name',
        'channel' : 'channel'
    };
};
Layer.primary = Layer.prototype.primary = function() {
    return '_id';
};
Layer.sequence = Layer.prototype.sequence = function() {
    return '_id';
};
Layer.key = Layer.prototype.key = function() {
    return 'id';
}
