var Utilities = require('../util/Utilities');
var User = require('../model/User');
var UserStore = require('../store/UserStore');

function UserService() {
    this.store = new UserStore();
}

module.exports = exports = UserService;

UserService.prototype.read = function(id, fn) {
    this.store.select({id:id}, function(ret) {
        if(!Utilities.isError(ret) && Utilities.isArray(ret)) {
            fn(new User(ret[0]));
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
