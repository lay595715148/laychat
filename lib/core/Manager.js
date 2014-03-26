var Factory = $require('util.Factory');
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
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('manager.');
    args.unshift(classname);
    args.unshift(Manager.instances);
    return Factory.factory.apply(null, args);
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Action}
 */
Manager.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('manager.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};
