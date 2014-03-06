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
            SubClass = require('../prefacer/' + classname);
        }
        instance = Prefacer.instances[classname] = $util.construct(SubClass, args);
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
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        SubClass = require('../prefacer/' + classname);
    }
    return $util.construct(SubClass, args);
};

Prefacer.prototype.run = function(fn) {
    $util.isFunction(fn) && fn();
};

