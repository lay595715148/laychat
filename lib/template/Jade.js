var Template = require('../template/Template');
var jade = require('jade');
var fs = require('fs');
var path = require('path');

/**
 * it will auto init()
 */
function Jade(req, res) {
    Template.call(this, jade, req, res);
    this.init();
}

$util.inherits(Jade, Template);

module.exports = exports = Jade;

/**
 * @api private
 */
Jade.prototype.init = function() {
    this.path(path.resolve(__dirname, '../../template'));
    this.resource(require(path.resolve(__dirname, '../../res/', 'zh-cn')));
};
Jade.prototype.out = function() {
    var vars = this._vars;
    var resources = this._resources;
    var engine = this._engine;
    var template = this._template;
    var content = '';

    try {
        content = engine.render(fs.readFileSync(template), $util.extend(vars, {res : resources}));
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
        content = engine.render(fs.readFileSync(template), $util.extend(vars, {res : resources}));
    } catch(e) {
        $logger.error(e);
    }

    if($util.isEmpty(headers)) {
        for( var pro in headers) {
            var upper = pro.toUpperCase();
            var val = headers[pro];
            if((upper === 'STATUS' || upper === 'STATUSCODE') && ($util.isString(val) || $util.isNumber(val))) {
                if($util.isString(val)) {
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
