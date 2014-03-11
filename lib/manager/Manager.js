/**
 * 
 */
function Manager(io) {
    this.io = io;
}

module.exports = exports = Manager;

Manager.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Manager}
 */
Manager.factory = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isA(Manager.instances[classname], Manager)) {
        instance = Manager.instances[classname];
    } else {
        if($util.isFunction(classname)) {
            SubClass = classname;
        } else {
            if(classname.indexOf('manager') === 0) {
                SubClass = $require(classname);
            } else {
                SubClass = $require('manager.' + classname);
            }
        }
        if($util.isFunction(SubClass)) {
            instance = Manager.instances[classname] = $util.construct(SubClass, args);
        }
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Action}
 */
Manager.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('manager') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('manager.' + classname);
        }
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};
