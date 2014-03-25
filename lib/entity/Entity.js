var Factory = require('../util/Factory');
/**
 *
 */
function Entity() {
    
}

module.exports = exports = Entity;

/**
 * 
 * @param {String} classname
 * @returns
 */
Entity.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('entity.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};
