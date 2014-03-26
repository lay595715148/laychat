var Collector = $require('util.Collector');
var Factory = $require('util.Factory');

/**
 *
 */
function Data() {
}

module.exports = exports = Data;

Data.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('data.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
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
