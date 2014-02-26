var Scope = require('../util/Scope');
var JAction = require('../action/JAction');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');

function CAction(req, res) {
    JAction.call(this, req, res);
}

$util.inherits(CAction, JAction);

module.exports = exports = CAction;

CAction.prototype.dispatch = function() {
    
    
    JAction.prototype.dispatch.call(this);
};
CAction.prototype.launch = function() {
};
