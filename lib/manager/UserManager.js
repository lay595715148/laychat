var config = require('../config/Configuration');
var Validater = require('../util/Validater');
var Utilities = require('../util/Utilities');
var logger = require('../util/Logger').logger;
var UserSummary = require('../data/UserSummary');
var UserProcesser = require('../processer/UserProcesser');
var Manager = require('../manager/Manager');

// 频道管理器
function UserManager(io) {
    this.io = io;
    this._ups = {};//存放UserProcesser数组
}

Utilities.inherits(UserManager, Manager);

module.exports = exports = UserManager;
