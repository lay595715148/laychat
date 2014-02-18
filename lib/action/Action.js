var Utilities = require('../util/Utilities');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

function Action(req, res, template, prefacer) {
    this.request = req;
    this.response = res;
    this.template = template;
    this.prefacer = prefacer;
}

module.exports = exports = Action;

Action.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Action}
 */
Action.factory = function(classname) {
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if(Utilities.isA(Action.instances[classname], Action)) {
        instance = Action.instances[classname];
    } else {
        var SubClass = require('../action/' + classname);
        instance = Action.instances[classname] = Utilities.construct(SubClass, args);
    }
    return instance;
};
/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Action}
 */
Action.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    var SubClass = require('../action/' + classname);
    return Utilities.construct(SubClass, args);
};

/**
 * @api public
 */
Action.prototype.run = function() {
    var me = this;
    if(Utilities.isA(this.prefacer, Prefacer)) {
        this.prefacer.run(function() {
            me.dispatch();
        });
    }
    return this;
};
/**
 * @api private
 */
Action.prototype.dispatch = function() {
    this.launch();
};
/**
 * @abstract
 */
Action.prototype.launch = function() {
    
};
