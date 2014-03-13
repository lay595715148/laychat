var Validater = require('../util/Validater');
var Processer = require('../processer/Processer');

function ReceiveProcesser(socket, us) {
    this.socket = socket;
    this.user = us;
}

$util.inherits(ReceiveProcesser, Processer);

module.exports = exports = ReceiveProcesser;

/**
 * 从缓存中拿取一条
 */
ReceiveProcesser.prototype.pick = function() {
    
};
/**
 * 从缓存中拿取一页
 */
ReceiveProcesser.prototype.pickNum = function(num) {
    
};
/**
 * 从缓存中拿取所有
 */
ReceiveProcesser.prototype.pickAll = function() {
    
};
