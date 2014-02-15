var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Utilities = require('../util/Utilities');
var ChannelUserProcesser = require('../processer/ChannelUserProcesser');
var Processer = require('../processer/Processer');

/**
 */
function UserProcesser() {
}

Utilities.inherits(UserProcesser, Processer);

module.exports = exports = UserProcesser;

UserProcesser.prototype.init = function() {
};
