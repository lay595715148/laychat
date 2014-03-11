var Scope = require('../util/Scope');

/**
 * 
 */
function Prefacer(req, res, action) {
    this.request = req;
    this.response = res;
    this.action = action;
    this.scope = new Scope(req);
}

module.exports = exports = Prefacer;

/**
 * @api private
 */
Prefacer.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Prefacer}
 */
Prefacer.factory = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isA(Prefacer.instances[classname], Prefacer)) {
        instance = Prefacer.instances[classname];
    } else {
        if($util.isFunction(classname)) {
            SubClass = classname;
        } else {
            if(classname.indexOf('prefacer') === 0) {
                SubClass = $require(classname);
            } else {
                SubClass = $require('prefacer.' + classname);
            }
        }
        if($util.isFunction(SubClass)) {
            instance = Prefacer.instances[classname] = $util.construct(SubClass, args);
        }
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Prefacer}
 */
Prefacer.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('prefacer') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('prefacer.' + classname);
        }
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};

Prefacer.prototype.run = function(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    $util.isFunction(fn) && fn.apply(fn, args);
};

