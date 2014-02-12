var Utilities = require('../util/Utilities');

function Async() {
    this.fns = [];
    this.rets = [];
}

module.exports = exports = Async;

Async.prototype.push = function(obj, method, args, fn) {
    var fns = this.fns;
    var afn = {
        obj:obj,
        method:method,
        args:args,
        fn:fn
    };
    fns[fns.length] = afn;
};
Async.prototype.exec = function(callback) {
    var fns = this.fns;
    var rets = this.rets;
    var i = 0;
    var once = function() {
        var afn = fns[i];
        var ret;
        if(Utilities.isFunction(afn.fn)) {
            afn.args[afn.args.length] = function() {
                ret = toArray(arguments);
                rets[i] = ret;
                afn.fn.apply(afn.fn, ret);
            };
        }
        if(Utilities.isEmpty(afn.obj) && Utilities.isFunction(afn.method)) {
            afn.method.apply(afn.method, afn.args);
        } else if(Utilities.isObject(afn.obj) && Utilities.isFunction(afn.method)) {
            afn.method.apply(afn.obj, afn.args);
        } else if(Utilities.isObject(afn.obj) && Utilities.isString(afn.method)) {
            afn.obj[afn.method].apply(afn.obj, afn.args);
        }
        i++;
        if(fns[i]) {
            once();
        } else if(Utilities.isFunction(callback)) {
            callback.apply(callback, rets);
        }
    };
    once();
};
