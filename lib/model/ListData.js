var Utilities = require('../util/Utilities');

/**
 * @param list {Array}
 * @param total {Number}
 * @param hasNext {Boolean}
 */
function ListData(list, total, hasNext) {
    this.list = [];
    this.total = 0;
    this.hasNext = false;
    
    if(Utilities.isObject(list) && !Utilities.isArray(list)) {
        list = list.list;
        total = list.total;
        hasNext = list.hasNext;
    }
    
    this.setList(list);
    this.setTotal(total);
    this.setHasNext(hasNext);
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
/**
 * @returns {Object}
 */
ListData.prototype.toJson = function() {
    return {'list':this.list.toJson(), 'total': this.total, 'hasNext':this.hasNext};
};
