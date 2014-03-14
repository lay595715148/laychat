var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var Channel = require('../model/Channel');
var Async = require('../util/Async');

function ChannelPrefacer(action) {
    Prefacer.call(this, action);
    
    this.uservice = Service.factory('UserService');
}

$util.inherits(ChannelPrefacer, Prefacer);

module.exports = exports = ChannelPrefacer;

ChannelPrefacer.prototype.run = function(fn) {
    $util.isFunction(fn) && fn();
};
