var Collector = require('../util/Collector');

function Data() {
}

module.exports = exports = Data;

Data.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('data') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('data.' + classname);
        }
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};
/**
 * 
 * @param list
 * @param total
 * @param hasNext
 * @returns
 */
Data.list = function(list, total, hasNext) {
    var datas = [];
    if($util.isArray(list)) {
        list.forEach(function(item) {
            datas.push(item);
        });
    }
    return Collector.list(datas, $util.isNumber(total)?total:datas.length, $util.isBoolean(hasNext)?hasNext:false);
};
