var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JAction = require('../action/JAction');
var Prefacer = require('../prefacer/Prefacer');
var Template = require('../template/Template');
var Service = require('../service/Service');
var Model = require('../model/Model');

function Api(req, res) {
    var name = $config.get('sign.action.api') || 'api';
    JAction.call(this, name, req, res);
}

$util.inherits(Api, JAction);

module.exports = exports = Api;

Api.prototype.dispatch = function() {
    this.launch();
};
Api.prototype.launch = function() {
};

