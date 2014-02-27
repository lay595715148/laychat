var JTAction = require('../action/JTAction');

function Token(req, res) {
    var name = $config.get('sign.action.token') || 'token';
    JOAction.call(this, name, req, res);
}

$util.inherits(Token, JTAction);

module.exports = exports = Token;

