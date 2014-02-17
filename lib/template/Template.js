var Utilities = require('../util/Utilities');
var Collector = require('../util/Collector');
var fs = require('fs');

function Template(engine, req, res) {
    this._request = req;
    this._response = res;
    this._engine = engine;
    this._path = '/template';
    this._vars = {};
    this._error = false;
    this._headers = {};
    this._metas = {};
    this._jses = [];
    this._javascript = [];
    this._csses = [];
    this._file = '';
    this._template = '';
    this._resources = {};
}

module.exports = exports = Template;

Template.prototype.header = function(headers, val) {
    var me = this;
    if(Utilities.isString(headers)) {
        if(Utilities.isUndefined(val)) {
            var pieces = headers.split(';');
            pieces.forEach(function(piece) {
                var pos = piece.indexOf(':');
                var pro = piece.substr(0, pos).trim();
                var val = piece.substr(pos + 1, piece.length - pos).trim();
                me.header(pro, val);
            });
        } else {
            this._headers[headers] = val;
        }
    } else if(Utilities.isArray(headers)) {
        headers.forEach(function(header) {
            me.header(header);
        });
    } else if(Utilities.isPureObject(headers)) {
        for( var pro in headers) {
            me.header(pro, headers[pro]);
        }
    }
};
Template.prototype.path = function(p) {
    if(Utilities.isString(p)) {
        this._path = p;
    }
};
Template.prototype.resource = function(name, val) {
    var me = this;
    if(Utilities.isString(name)) {
        this._resources[name] = val;
    } else if(Utilities.isArray(name)) {
        js.forEach(function(n) {
            me.resource(n);
        });
    } else if(Utilities.isObject(name)) {
        for( var pro in name) {
            me.resource(pro, name[pro]);
        }
    }
};
Template.prototype.title = function(str, l) {
    var vars = this._vars;
    if(Utilities.isUndefined(vars.title)) {
        vars.title = str;
    } else {
        if(l === true) {
            vars.title = vars.title + str;
        } else {
            vars.title += str;
        }
    }
};
Template.prototype.push = function(name, val) {
    var me = this;
    var vars = this._vars;
    if(Utilities.isString(name)) {
        vars[name] = val;
    } else if(Utilities.isArray(name)) {
        name.forEach(function(n) {
            me.push(n);
        });
    } else if(Utilities.isPureObject(name)) {
        for( var pro in name) {
            me.push(pro, name[pro]);
        }
    }
};
// for root path or absolute path
Template.prototype.file = function(f) {
    if(Utilities.isString(f)) {
        this._file = f;
    }
};
Template.prototype.template = function(tpl) {
    if(Utilities.isString(tpl) && Utilities.isDefined(this._path)) {
        if(tpl.indexOf(this._path) != -1) {
            this._template = tpl;
        } else {
            this._template = this._path + tpl;
        }
    }
};
Template.prototype.meta = function(meta, val) {
    var me = this;
    if(Utilities.isString(meta)) {
        this._metas[meta] = val;
    } else if(Utilities.isArray(meta)) {
        meta.forEach(function(m) {
            me.meta(m);
        });
    } else if(Utilities.isPureObject(meta)) {
        for( var pro in meta) {
            me.meta(pro, meta[pro]);
        }
    }
};
Template.prototype.js = function(js) {
    var me = this;
    if(Utilities.isString(js)) {
        this._jses.push(js);
    } else if(Utilities.isArray(js)) {
        js.forEach(function(j) {
            me.js(j);
        });
    }
};
Template.prototype.javascript = function(js) {
    var me = this;
    if(Utilities.isString(js)) {
        this._javascript.push(js);
    } else if(Utilities.isArray(js)) {
        js.forEach(function(j) {
            me.javascript(j);
        });
    }
};
Template.prototype.css = function(css) {
    var me = this;
    if(Utilities.isString(css)) {
        this._css.push(css);
    } else if(Utilities.isArray(css)) {
        css.forEach(function(c) {
            me.css(c);
        });
    }
};
Template.prototype.vars = function() {
    return this._vars;
};
Template.prototype.attachment = function(f) {
    if(Utilities.isString(f)) {
        this.file(f);
    }

    var res = this._response;
    var file = this._file;

    if(fs.existsSync(file)) {
        res.attachment(file);
    }
};

Template.prototype.error = function() {
    var res = this._response;
    res.json(this._vars);
};
Template.prototype.json = function() {
    var res = this._response;
    res.json(this._vars);
};
Template.prototype.jsonp = function() {
    var res = this._response;
    res.jsonp(this._vars);
};
Template.prototype.xml = function() {
    var res = this._response;
    var vars = this._vars;
    var headers = this._headers;
    var content = Utilities.toXml({
        root : vars
    });

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

    res.end(content);
};
/**
 * @abstract
 */
Template.prototype.out = function() {
};
/**
 * @abstract
 */
Template.prototype.display = function() {
};
