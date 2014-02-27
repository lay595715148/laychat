var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

/**
 * @abstract
 */
function Action(name, req, res, template, prefacer) {
    this.name = name;
    /**
     * @api protected
     */
    this.request = req;
    /**
     * @api protected
     */
    this.response = res;
    /**
     * @api protected
     */
    this.template = template;
    /**
     * @api protected
     */
    this.prefacer = prefacer;
    /**
     * @api protected
     */
    this.scope = null;
}

module.exports = exports = Action;

Action.instances = {};
/**
 * @api public
 * @param {String} classname
 * @returns {Action}
 */
Action.factory = function(classname) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isA(Action.instances[classname], Action)) {
        instance = Action.instances[classname];
    } else {
        if($util.isFunction(classname)) {
            SubClass = classname;
        } else {
            SubClass = require('../action/' + classname);
        }
        instance = Action.instances[classname] = $util.construct(SubClass, args);
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
    var SubClass;
    var args = Array.prototype.slice.call(arguments, 1);
    if($util.isFunction(classname)) {
        SubClass = classname;
    } else {
        SubClass = require('../action/' + classname);
    }
    return $util.construct(SubClass, args);
};

/**
 * @api public
 */
Action.prototype.run = function() {
    var me = this;
    if($util.isA(this.prefacer, Prefacer)) {
        this.prefacer.run(function() {
            me.dispatch();
        });
    } else {
        this.dispatch();
    }
    return this;
};
/**
 * @api protected
 */
Action.prototype.dispatch = function() {
    this.launch();
};
/**
 * @abstract
 */
Action.prototype.launch = function() {
    
};
