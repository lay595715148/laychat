var Collector = require('./util/Collector');
var Utilities = require('./util/Utilities');
var Validater = require('./util/Validater');

module.exports = exports = require('./manager/ChannelManager');

/*Laychat.Layfig = require('./layfig');*/
exports.Collector = Collector;
exports.Utilities = Utilities;
exports.Validater = Validater;

exports.extend = Utilities.extend;
exports.checkRequest = Validater.checkRequest;
