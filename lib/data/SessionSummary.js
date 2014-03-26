/**
 * SessionSummary对象
 * @param id {Number}
 * @param data {String}
 */
function SessionSummary(id, data) {
    var _id = 0, _data= '';
    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        data = tmp.data;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isInteger(id))
            _id = id;
    });
    this.__defineSetter__('data', function(data) {
        if($util.isString(data))
            _data = data;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('data', function() {
        return _data;
    });

    this.id = id;
    this.data = data;
}

module.exports = exports = SessionSummary;

/**
 * 
 * @param id {Number}
 */
SessionSummary.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
SessionSummary.prototype.setData = function(data) {
    this.data = data;
};
/**
 * 
 * @param id {Number}
 */
SessionSummary.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @param name {String}
 */
SessionSummary.prototype.getData = function() {
    return this.data;
};