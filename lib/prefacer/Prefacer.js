var Utilities = require('../util/Utilities');

function Prefacer(req, res) {
    this.req = req;
    this.res = res;
}

module.exports = exports = Prefacer;

Prefacer.prototype.run = function(fn) {
    if(Utilities.isFunction(fn)) {
        fn();
    }
};