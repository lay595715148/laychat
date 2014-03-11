function Model() {
}

module.exports = exports = Model;

Model.instance = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('model') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('model.' + classname);
        }
        //SubClass = require('../model/' + classname);
    }
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};
Model.require = function(classname) {
    var SubClass;
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        if(classname.indexOf('model') === 0) {
            SubClass = $require(classname);
        } else {
            SubClass = $require('model.' + classname);
        }
        //SubClass = require('../model/' + classname);
    }
    return SubClass;
};

/**
 * @abstract
 */
Model.table = Model.prototype.table = function() {};
/**
 * @abstract
 */
Model.columns = Model.prototype.columns = function() {};
/**
 * @abstract
 */
Model.primary = Model.prototype.primary = function() {
    return '_id';
};
/**
 * @abstract
 */
Model.sequence = Model.prototype.sequence = function() {};
