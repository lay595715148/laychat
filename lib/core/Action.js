var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var Scope = $.util.Scope;
var Template = $.core.Template;
var Factory = $.util.Factory;

/**
 * @abstract
 */
function Action(name, req, res, template) {
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
    this.scope = new Scope(req);
}

$util.inherits(Action, EventEmitter);

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
 * @protected
 */
Action.prototype.onCreate = function() {
    $logger.info($util.getClass(this) + ' onCreate');
    this.emit('start');
};
/**
 * @protected
 */
Action.prototype.onStart = function() {
    $logger.info($util.getClass(this) + ' onStart');
    this.emit('request');
};
/**
 * @protected
 */
Action.prototype.onRequest = function() {
    $logger.info($util.getClass(this) + ' onRequest');
    if(this.request.method === 'GET') {
        this.emit('get');
    } else if(this.request.method === 'POST') {
        this.emit('post');
    } else {
        this.emit('stop');
    }
};
/**
 * @protected
 */
Action.prototype.onGet = function() {
    $logger.info($util.getClass(this) + ' onGet');
    this.emit('stop');
};
/**
 * @protected
 */
Action.prototype.onPost = function() {
    $logger.info($util.getClass(this) + ' onPost');
    this.emit('stop');
};
/**
 * @protected
 */
Action.prototype.onStop = function() {
    $logger.info($util.getClass(this) + ' onStop');
    this.emit('destroy');
};
/**
 * @protected
 */
Action.prototype.onDestroy = function() {
    $logger.info($util.getClass(this) + ' onDestroy');
};
