var Channel = $.model.Channel;
var Model = $.core.Model;
var Store = $.core.Store;
var StoreService = $.service.StoreService;

function ChannelService() {
    StoreService.call(this);
    this.store.mongo = Store.factory('store.mongo.ChannelMongo');
    this.store.memcache = Store.factory('store.memcache.ChannelMemcache');
}

$util.inherits(ChannelService, StoreService);

module.exports = exports = ChannelService;

ChannelService.prototype.read = function(id, fn) {
    
    this.store.mongo.select({_id:id}, function(ret) {
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
    this.store.mongo.select({}, function(channels) {
        if(!$util.isError(channels) && $util.isArray(channels)) {
            fn(channels);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {Channel} channel
 */
ChannelService.prototype.create = function(channel, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    channel = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(channel, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
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
