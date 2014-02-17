var Utilities = require('../util/Utilities');
var Template = require('../template/Template');
var jade = require('jade');
var fs = require('fs');
var path = require('path');

function Jade(req, res) {
    Template.call(this, jade, req, res);
    this.init();
}

Utilities.inherits(Jade, Template);

module.exports = exports = Jade;

/**
 * @api private
 */
Jade.prototype.init = function() {
    this.path(path.resolve(__dirname, '../../static/template'));
    this.resource(require(path.resolve(__dirname, '../../static/res/', 'zh-cn', 'res.js')));
};
Jade.prototype.out = function() {
    var vars = this._vars;
    var resources = this._resources;
    var engine = this._engine;
    var template = this._template;
    var content = '';

    try {
        content = engine.render(fs.readFileSync(template), Utilities.extend(vars, {res : resources}));
    } catch(e) {
        $logger.error(e);
    }

    return content;
};
Jade.prototype.display = function() {
    var vars = this._vars;
    var res = this._response;
    var resources = this._resources;
    var engine = this._engine;
    var template = this._template;
    var headers = this._headers;
    var content = '';

    try {
        content = engine.render(fs.readFileSync(template), Utilities.extend(vars, {res : resources}));
    } catch(e) {
        $logger.error(e);
    }

    if(Utilities.isEmpty(headers)) {
        for( var pro in headers) {
            var upper = pro.toUpperCase();
            var val = headers[pro];
            if((upper === 'STATUS' || upper === 'STATUSCODE') && (Utilities.isString(val) || Utilities.isNumber(val))) {
                if(Utilities.isString(val)) {
                    val = parseInt(val);
                }
                res.statusCode = val;
            } else {
                res.setHeader(pro, val);
            }
        }
    }

    res.send(content);
};