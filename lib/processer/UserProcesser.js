var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Utilities = require('../util/Utilities');
var Processer = require('../processer/Processer');
var Service = require('../service/Service');

/**
 */
function UserProcesser() {
}

Utilities.inherits(UserProcesser, Processer);

module.exports = exports = UserProcesser;

UserProcesser.prototype.init = function() {
};
