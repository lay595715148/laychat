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
    this.store.select({id:id}, function(ret) {
        if(!Utilities.isError(ret) && Utilities.isArray(ret)) {
            fn(new Channel(ret[0]));
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
