var fs = require('fs');
var Scope = $require('util.Scope');
var Prefacer = $require('prefacer.Prefacer');
var Template = $require('template.Template');
var Factory = $require('util.Factory');

/**
 * @abstract
 */
function Action(name, req, res, template, prefacer) {
    /**
     * @api protected
     */
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
    this.scope = new Scope(req);
}

module.exports = exports = Action;

/**
 * 每次都是新的
 * @api public
 * @param {String} classname
 * @returns {Action}
 */
Action.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('action.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
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
