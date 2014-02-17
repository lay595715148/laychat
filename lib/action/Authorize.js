var Utilities = require('../util/Utilities');
var Action = require('../action/Action');

function Authorize(req, res) {
    this.Request = req;
    this.res = res;
}

Utilities.inherits(Authorize, Action);

module.exports = exports = Authorize;
