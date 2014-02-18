var Utilities = require('../util/Utilities');
var Prefacer = require('../prefacer/Prefacer');
var UserService = require('../service/UserService');
var Channel = require('../model/Channel');
var Async = require('../util/Async');

function ChannelPrefacer(req, res) {
    Prefacer.call(this, req, res);
    
    this.uservice = new UserService();
}

Utilities.inherits(ChannelPrefacer, Prefacer);

module.exports = exports = ChannelPrefacer;

ChannelPrefacer.prototype.run = function(fn) {
    Utilities.isFunction(fn) && fn();
};
