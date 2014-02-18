var Utilities = require('../util/Utilities');
var Memcache = require('../store/Memcache');
var User = require('../model/User');

function UserMemcache() {
    Memcache.call(this, User, $config.get('servers.memcache.master'));
}

Utilities.inherits(UserMemcache, Memcache);

module.exports = exports = UserMemcache;
