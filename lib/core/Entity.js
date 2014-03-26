var Factory = $require('util.Factory');
var Reliable = $require('util.Reliable');
/**
 *
 */
function Entity() {
    
}

$util.inherits(Entity, Reliable);

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

/**
 * 主键属性名
 * @abstract
 */
Entity.key = Entity.prototype.key = function() {};
