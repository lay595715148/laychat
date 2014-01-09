var util = require('util');

function ListData() {
    this.list = [];
    this.total = 0;
    this.hasNext = false;
}

module.exports = exports = ListData;

ListData.prototype.setList = function(list) {
    if(util.isArray(list))  {
        this.list = list;
    }
};
ListData.prototype.setTotal = function(total) {
    if('number' == typeof total)  {
        this.total = total;
    }
};
ListData.prototype.setHasNext = function(hasNext) {
    if('boolean' == typeof hasNext)  {
        this.hasNext = hasNext;
    }
};
