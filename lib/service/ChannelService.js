var Utilities = require('../util/Utilities');
var Channel = require('../model/Channel');
var ChannelStore = require('../store/ChannelStore');
var Service = require('../service/Service');

function ChannelService() {
    this.store = new ChannelStore();
}

Utilities.inherits(ChannelService, Service);

module.exports = exports = ChannelService;

ChannelService.prototype.read = function(id, fn) {
    this.store.select({id:id}, function(channels) {
        if(!Utilities.isError(channels) && Utilities.isArray(channels)) {
            fn(channels[0]);
        }
    });
};
ChannelService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.select({}, function(channels) {
        if(!Utilities.isError(channels) && Utilities.isArray(channels)) {
            fn(channels);
        }
    });
};
/**
 * 
 * @param {User} user
 */
ChannelService.prototype.create = function(user) {
    
};
ChannelService.prototype.update = function(id, params) {
    
};
/**
 * 异步
 * @param {Number} id
 * @param {Function} fn
 */
ChannelService.prototype.readAsync = function(id, fn) {
    
};
