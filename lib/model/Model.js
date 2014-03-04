function Model() {
}

module.exports = exports = Model;

Model.instance = function(classname) {
    var SubClass;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        SubClass = require('../model/' + classname);
    }
    return $util.construct(SubClass, args);
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
