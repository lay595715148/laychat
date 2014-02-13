var Utilities = require('../util/Utilities');

function Async() {
    this.fns = [];
    this.rets = [];
}

module.exports = exports = Async;

/**
 * 
 * @param method
 * @param args
 * @param obj
 * @param fn
 */
Async.prototype.push = function(method, args, obj, fn) {
    var fns = this.fns;
    var argus = Array.prototype.slice.call(arguments, 0);
    method = argus.length ? argus.shift() || {} : {};
    args = argus.length ? argus.shift() || [] : [];
    if(Utilities.isFunction(obj)) {
        fn = obj;
        obj = null;
    } else {
        obj = argus.length ? argus.shift() || null : null;
    }
    fns.push({
        method:method,
        args:args,
        obj:obj,
        fn:fn
    });
};
Async.prototype.exec = function(opts, callback) {
    var fns = this.fns;
    var rets = this.rets;
    var i = 0;
    var defaults = {
        auto:true
    };
    
    if(Utilities.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else if(Utilities.isPureObject(opts)) {
        opts = Utilities.extend(defaults, opts);
    }
    
    var once = function() {
        var afn = Utilities.clone(fns[i]);
        var ret;
        if(Utilities.isFunction(afn.fn) || opts.auto) {
            afn.args.push(function() {
                rets[i] = ret = toArray(arguments);
                i++;
                
                if(Utilities.isFunction(afn.fn)) {
                    afn.fn.apply(afn.fn, ret);
                }
                
                if(fns[i]) {
                    once();
                } else if(Utilities.isFunction(callback)) {
                    callback.apply(callback, rets);
                }
            });
            if(Utilities.isEmpty(afn.obj) && Utilities.isFunction(afn.method)) {
                afn.method.apply(afn.method, afn.args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isFunction(afn.method)) {
                afn.method.apply(afn.obj, afn.args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isString(afn.method)) {
                afn.obj[afn.method].apply(afn.obj, afn.args);
            }
        } else {
            if(Utilities.isEmpty(afn.obj) && Utilities.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.method, afn.args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.obj, afn.args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isString(afn.method)) {
                rets[i] = ret = afn.obj[afn.method].apply(afn.obj, afn.args);
            }
            i++;
            
            if(fns[i]) {
                once();
            } else if(Utilities.isFunction(callback)) {
                callback.apply(callback, rets);
            }
            
        }
    };
    once();
};
/**
 * 顺序执行所有方法或函数，且上一个方法或函数的回调结果将作为参数传递给下一个方法或函数
 * 
 * @param callback
 */
Async.prototype.sync = function(args, opts, callback) {
    var fns = this.fns;
    var rets = this.rets;
    var i = 0;
    var defaults = {
        auto:true
    };
    
    if(Utilities.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else if(Utilities.isPureObject(opts)) {
        opts = Utilities.extend(defaults, opts);
    }
    
    var once = function(args) {
        var afn = Utilities.clone(fns[i]);
        var ret;
        args = toArray(args);
        if(Utilities.isFunction(afn.fn) || opts.auto) {
            args.push(function() {
                rets[i] = ret = toArray(arguments);
                if(Utilities.isFunction(afn.fn)) {
                    afn.fn.apply(afn.fn, ret);
                }
                i++;
                
                if(fns[i]) {
                    once.call(once, ret);
                } else if(Utilities.isFunction(callback)) {
                    callback.apply(callback, rets);
                }
            });
            if(Utilities.isEmpty(afn.obj) && Utilities.isFunction(afn.method)) {
                afn.method.apply(afn.method, args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isFunction(afn.method)) {
                afn.method.apply(afn.obj, args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isString(afn.method)) {
                afn.obj[afn.method].apply(afn.obj, args);
            }
        } else {
            if(Utilities.isEmpty(afn.obj) && Utilities.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.method, args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isFunction(afn.method)) {
                rets[i] = ret = afn.method.apply(afn.obj, args);
            } else if(Utilities.isObject(afn.obj) && Utilities.isString(afn.method)) {
                rets[i] = ret = afn.obj[afn.method].apply(afn.obj, args);
            }
            i++;
            
            if(fns[i]) {
                console.log('current ret', ret);
                once.call(once, isArray(ret)?ret:[ret]);
            } else if(Utilities.isFunction(callback)) {
                callback.apply(callback, rets);
            }
        }
    };
    once(args);
};
