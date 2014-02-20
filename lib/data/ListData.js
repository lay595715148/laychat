var Utilities = require('../util/Utilities');

/**
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 */
function ListData(list, total, hasNext) {
    var _list = [], _total = 0, _hasNext = false;
    
    if(Utilities.isObject(list) && !Utilities.isNull(list) && !Utilities.isArray(list)) {
        var tmp = list;
        list = tmp.list;
        total = tmp.total;
        hasNext = tmp.hasNext;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('list', function(list) {
        if(Utilities.isArray(list))
            _list = list;
    });
    this.__defineSetter__('total', function(total) {
        if(Utilities.isNumber(total))
            _total = total;
    });
    this.__defineSetter__('hasNext', function(hasNext) {
        if(Utilities.isBoolean(hasNext))
            _hasNext = hasNext;
    });
    this.__defineGetter__('list', function() {
        return _list;
    });
    this.__defineGetter__('total', function() {
        return _total;
    });
    this.__defineGetter__('hasNext', function() {
        return _hasNext;
    });
    
    this.list = list;
    this.total = total;
    this.hasNext = hasNext;
}

module.exports = exports = ListData;

/**
 * 
 * @param list {Array}
 */
ListData.prototype.setList = function(list) {
    if(Utilities.isArray(list))
        this.list = list;
};
/**
 * 
 * @param total {Number}
 */
ListData.prototype.setTotal = function(total) {
    if(Utilities.isNumber(total))
        this.total = total;
};
/**
 * 
 * @param hasNext {Boolean}
 */
ListData.prototype.setHasNext = function(hasNext) {
    if(Utilities.isBoolean(hasNext))
        this.hasNext = hasNext;
};
