/**
 * 
 */
function Service(store) {
    this.store = store;
}

module.exports = exports = Service;

/**
 * @api private
 */
Service.instances = {};
/**
 * 
 * 
 * @api public
 * @param {String} classname
 * @returns {Service}
 */
Service.factory = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isA(Service.instances[classname], Service)) {
        instance = Service.instances[classname];
    } else {
        if(classname.indexOf('service') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('service.' + classname);
        }
        if($util.isFunction(SubClass)) {
            instance = Service.instances[classname] = $util.construct(SubClass, args);
        }
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Service}
 */
Service.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('service') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('service.' + classname);
        }
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};
