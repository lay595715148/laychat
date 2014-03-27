var Prefacer = $.core.Prefacer;
var Service = $.core.Service;
var Channel = $.model.Channel;
var Async = $.util.Async;

function ChannelPrefacer(action) {
    Prefacer.call(this, action);
    
    this.uservice = Service.factory('UserService');
}

$util.inherits(ChannelPrefacer, Prefacer);

module.exports = exports = ChannelPrefacer;

ChannelPrefacer.prototype.run = function(fn) {
    $util.isFunction(fn) && fn();
};
