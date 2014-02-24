var Data = require('../data/Data');

/**
 * 后续还需要根据rfc2822进行修改
 */
function Message(content, headers) {
    this.content = content;
    this.headers = headers;
}

$util.inherits(Message, Data);

module.exports = exports = Message;
