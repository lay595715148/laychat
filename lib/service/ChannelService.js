var Channel = require('../model/Channel');
var Store = require('../store/Store');
var Service = require('../service/Service');

function ChannelService() {
    this.store = Store.factory('ChannelStore');
}

$util.inherits(ChannelService, Service);

module.exports = exports = ChannelService;

ChannelService.prototype.read = function(id, fn) {
    this.store.select({id:id}, function(ret) {
        if(!$util.isError(ret) && $util.isArray(ret) && !$util.isEmpty(ret)) {
            fn(ret[0]);
        } else {
            fn(false);
        }
    });
};
ChannelService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.select({}, function(channels) {
        if(!$util.isError(channels) && $util.isArray(channels)) {
            fn(channels);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {User} user
 */
ChannelService.prototype.create = function(user, fn) {
    
};
ChannelService.prototype.update = function(id, params, fn) {
    
};
/**
 * 异步
 * @param {Number} id
 * @param {Function} fn
 */
ChannelService.prototype.readAsync = function(id, fn) {
    
};
