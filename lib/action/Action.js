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
