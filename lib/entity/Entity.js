function Entity() {
    
}

module.exports = exports = Entity;

/**
 * 
 * @param {String} classname
 * @returns
 */
Entity.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('entity') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('entity.' + classname);
        }
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};
