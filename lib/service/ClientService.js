var md5 = $.util.MD5;
var Client = $.model.Client;
var Model = $.core.Model;
var Store = $.core.Store;
var StoreService = $.service.StoreService;

function ClientService() {
    StoreService.call(this);
    this.store.mongo = Store.factory('store.mongo.ClientMongo');
    this.store.memcache = Store.factory('store.memcache.ClientMemcache');
}

$util.inherits(ClientService, StoreService);

module.exports = exports = ClientService;

ClientService.prototype.read = function(id, fn) {
    this.store.mongo.select({id:id}, function(ret) {
        if(!$util.isError(ret) && $util.isArray(ret) && !$util.isEmpty(ret)) {
            fn(ret[0]);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.checkClient = function(query, fn) {
    this.store.mongo.selectOne(query, function(ret) {
        if(!$util.isError(ret) && $util.isA(ret, Client)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param clientname
 * @param password md5前
 */
ClientService.prototype.readBySecret = function(clientid, clientsecret, fn) {
    this.store.mongo.selectOne({clientId:clientid, clientSecret:clientsecret}, function(ret) {
        if(!$util.isError(ret) && $util.isA(ret, Client)) {
            fn(ret);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.select(selector, function(clients) {
        if(!$util.isError(clients) && $util.isArray(clients)) {
            fn(clients);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.count = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.mongo.count(selector, function(count) {
        if(!$util.isError(count)) {
            fn(count);
        } else {
            fn(false);
        }
    });
};
/**
 * 
 * @param {Client} client
 */
ClientService.prototype.create = function(client, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    client = args.length ? args.shift() || {} : {};
    
    this.store.mongo.insert(client, function(ret) {
        if(ret) {
            fn(true);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.modify = function(id, params, fn) {
    
};
ClientService.prototype.mread = function(id, fn) {
    var key = id;
    this.store.memcache.get(key, function(ret) {
        if($util.isString(ret)) {
            fn(Model.instance('Client', $util.toJson(ret)));
        } else {
            fn(ret);
        }
    });
};
ClientService.prototype.mcreate = function(client, lifetime, fn) {
    var key = id;
    if($util.isFunction(lifetime)) {
        fn = lifetime;
        liftime = 1800;
    }
    this.store.memcache.set(key, $util.toString(client), liftime, function(ret) {
        fn(ret);
    });
};
ClientService.prototype.mremove = function(id, fn) {
    var key = id;
    this.store.memcache.del(key, function(ret) {
        fn(ret);
    });
};
