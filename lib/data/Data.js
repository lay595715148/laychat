var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');

function Data() {
}

module.exports = exports = Data;

Data.list = function(list, total, hasNext) {
    var datas = [];
    if(Utilities.isArray(list)) {
        list.forEach(function(item) {
            datas.push(item);
        });
    }
    return Collector.list(datas, Utilities.isNumber(total)?total:datas.length, Utilities.isBoolean(hasNext)?hasNext:false);
};
