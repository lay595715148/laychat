var Utilities = require('../util/Utilities');
var User = require('../model/User');
var UserStore = require('../store/UserStore');
var Service = require('../service/Service');

function UserService() {
    this.store = new UserStore();
}

Utilities.inherits(UserService, Service);

module.exports = exports = UserService;

UserService.prototype.read = function(id, fn) {
    this.store.select({id:id}, function(ret) {
        if(!Utilities.isError(ret) && Utilities.isArray(ret)) {
            fn(new User(ret[0]));
        }
    });
};
UserService.prototype.list = function(selector, opts, fn) {
    var args = Array.prototype.slice.call(arguments, 0);
    fn = args.pop();
    selector = args.length ? args.shift() || {} : {};
    opts = args.length ? args.shift() || {} : {};
    this.store.select({}, function(users) {
        if(!Utilities.isError(users) && Utilities.isArray(users)) {
            fn(users);
        }
    });
};
UserService.prototype.readByPassword = function(username, password) {
    
};
/**
 * 
 * @param {User} user
 */
UserService.prototype.create = function(user) {
    
};
UserService.prototype.modify = function(id, params) {
    
};
/**
 * 异步
 * @param {Number} id
 * @param {Function} fn
 */
UserService.prototype.readAsync = function(id, fn) {
    
};
