var Store = require('../store/Store');
var redis = require('redis');

function Redis(model, config) {
    Store.call(this, model, config);
}

$util.inherits(Redis, Store);

module.exports = exports = Redis;
