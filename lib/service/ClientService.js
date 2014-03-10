var md5 = require('../util/MD5');
var Client = require('../model/Client');
var Store = require('../store/Store');
var Service = require('../service/Service');

function ClientService() {
    this.store = Store.factory('ClientStore');
    this.memcache = Store.factory('ClientMemcache');
}

$util.inherits(ClientService, Service);

module.exports = exports = ClientService;

ClientService.prototype.read = function(id, fn) {
    this.store.select({id:id}, function(ret) {
        if(!$util.isError(ret) && $util.isArray(ret) && !$util.isEmpty(ret)) {
            fn(ret[0]);
        } else {
            fn(false);
        }
    });
};
ClientService.prototype.checkClient = function(query, fn) {
    this.store.selectOne(query, function(ret) {
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
    this.store.selectOne({clientId:clientid, clientSecret:clientsecret}, function(ret) {
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
    this.store.select(selector, function(clients) {
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
    this.store.count(selector, function(count) {
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
    
    this.store.insert(client, function(ret) {
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
    this.memcache.get(key, function(ret) {
        if($util.isString(ret)) {
            fn(new Client($util.toJson(ret)));
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
    this.memcache.set(key, $util.toString(client), function(ret) {
        fn(ret);
    }, liftime);
};
ClientService.prototype.mremove = function(id, fn) {
    var key = id;
    this.memcache.del(key, function(ret) {
        fn(ret);
    });
};
