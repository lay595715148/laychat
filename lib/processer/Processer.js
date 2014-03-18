
function Processer() {
}

module.exports = exports = Processer;

/**
 * @api private
 */
Processer.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Processer}
 */
Processer.factory = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isA(Processer.instances[classname], Processer)) {
        instance = Prefacer.instances[classname];
    } else {
        if(classname.indexOf('processer') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('processer.' + classname);
        }
        if($util.isFunction(SubClass)) {
            instance = Processer.instances[classname] = $util.construct(SubClass, args);
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
Processer.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('processer') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('processer.' + classname);
        }
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};
