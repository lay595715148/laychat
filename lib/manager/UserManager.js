var Validater = require('../util/Validater');
var Manager = require('../manager/Manager');

// 用户管理器
function UserManager(io) {
    this.io = io;
    this._ups = {};//存放UserProcesser数组
}

$util.inherits(UserManager, Manager);

module.exports = exports = UserManager;
