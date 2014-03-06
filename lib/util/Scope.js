/**
 * 
 */
function Scope(req) {
    var _request = {}, _chunks = [];

    this.__defineSetter__('req', function(request) {
        if($util.isObject(request) && !$util.isNull(request))
            _request = request;
    });
    this.__defineSetter__('chunks', function(chunks) {
        if($util.isArray(chunks))
            _chunks = chunks;
    });
    this.__defineGetter__('req', function() {
        return _request;
    });
    this.__defineGetter__('chunks', function() {
        return _chunks;
    });

    this.req = req;
    this.chunks = [];
    this.resolve();
};

// module exports
module.exports = exports = Scope;

Scope.GET = 0;
Scope.POST = 1;
Scope.REQUEST = 2;
Scope.COOKIE = 3;
Scope.SESSION = 4;
Scope.PARAM = 5;
Scope.HEADER = 6;
Scope.USER = 7;
/**
 * @param {Object}
 *            request
 *            request.query,request.body,request.method,request.ssession,request.cookies...
 */
Scope.prototype.get = function(request) {
    return this.resolve(false, request)[Scope.GET];
};
Scope.prototype.post = function(request) {
    return this.resolve(false, request)[Scope.POST];
};
Scope.prototype.request = function(request) {
    return this.resolve(false, request)[Scope.REQUEST];
};
Scope.prototype.cookie = function(request) {
    return this.resolve(false, request)[Scope.COOKIE];
};
Scope.prototype.session = function(request) {
    return this.resolve(false, request)[Scope.SESSION];
};
Scope.prototype.param = function(request) {
    return this.resolve(false, request)[Scope.PARAM];
};
Scope.prototype.header = function(request) {
    return this.resolve(false, request)[Scope.HEADER];
};
Scope.prototype.user = function(request) {
    return this.resolve(false, request)[Scope.USER];
};
/**
 * @api private
 * @param request
 * @param reset
 * @returns {Array}
 */
Scope.prototype.resolve = function(reset, request) {
    var _get = {}, _post = {}, _request = {}, _cookie = {}, _session = {}, _param = {}, _header = {}, _user = {};

    if($util.isArray(this.chunks) && !$util.isEmpty(this.chunks) && reset !== true)
        return this.chunks;

    request = $util.extend(this.req, request);
    if($util.isObject(request)) {
        if(request.method === 'POST') {
            _get = request.query || {};
            _post = request.body || {};
            _request = $util.extend($util.clone(_get), $util.clone(_post));
        } else {
            _get = request.query || {};
            _request = _get;
        }
        _session = request.session || {};
        _cookie = request.cookies || {};
        _param = request.params || {};
        _header = request.headers || {};
        _user = request.user || {};
    }
    this.chunks = [_get, _post, _request, _cookie, _session, _param, _header, _user];

    return this.chunks;
};
