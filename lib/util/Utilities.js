var util = require('util');

module.exports = exports = Utilities;

/**
 * 
 * @param target
 *            {Object}
 * @returns
 */
Utilities.extend = global.extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function(source) {
        for( var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
};

Utilities.isString = global.isString = function(str) {
    return 'string' === typeof str ? true : false;
};
Utilities.isNumber = global.isNumber = function(num) {
    return 'number' === typeof num ? true : false;
};
Utilities.isBoolean = global.isBoolean = function(boo) {
    return 'boolean' === typeof boo ? true : false;
};
Utilities.isObject = global.isObject = function(obj) {
    return 'object' === typeof obj ? true : false;
};
Utilities.isArray = global.isArray = function(arr) {
    return util.isArray(key) ? true : false;
};
Utilities.isInteger = global.isInteger = function(int) {
    
};

function Utilities() {
}
