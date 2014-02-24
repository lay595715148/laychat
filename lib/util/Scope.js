/**
 * 
 */
function Scope(req) {
    var _request = {}, _chunks = [];

    this.__defineSetter__('request', function(request) {
        if($util.isObject(request) && !$util.isNull(request))
            _request = request;
    });
    this.__defineSetter__('chunks', function(chunks) {
        if($util.isArray(chunks))
            _chunks = chunks;
    });
    this.__defineGetter__('request', function() {
        return _request;
    });
    this.__defineGetter__('chunks', function() {
        return _chunks;
    });

    this.request = req;
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
/**
 * @param {Object}
 *            request
 *            request.query,request.body,request.method,request.ssession,request.cookies...
 */
Scope.prototype.get = function(request) {
    request = $util.extend(this.request, request);
    return this.resolve(request)[Scope.GET];
};
Scope.prototype.post = function(request) {
    request = $util.extend(this.request, request);
    return this.resolve(request)[Scope.POST];
};
Scope.prototype.request = function(request) {
    request = $util.extend(this.request, request);
    return this.resolve(request)[Scope.REQUEST];
};
Scope.prototype.cookie = function(request) {
    request = $util.extend(this.request, request);
    return this.resolve(request)[Scope.COOKIE];
};
Scope.prototype.session = function(request) {
    request = $util.extend(this.request, request);
    return this.resolve(request)[Scope.SESSION];
};
Scope.prototype.param = function(request) {
    request = $util.extend(this.request, request);
    return this.resolve(request)[Scope.PARAM];
};
Scope.prototype.header = function(request) {
    request = $util.extend(this.request, request);
    return this.resolve(request)[Scope.HEADER];
};
/**
 * @api private
 * @param request
 * @param reset
 * @returns {Array}
 */
Scope.prototype.resolve = function(request, reset) {
    var _get = {}, _post = {}, _request = {}, _cookie = {}, _session = {}, _param = {}, _header = {};

    if($util.isArray(this.chunks) && !$util.isEmpty(this.chunks) && reset !== true)
        return this.chunks;

    request = $util.extend(this.request, request);
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
    }
    this.chunks = [_get, _post, _request, _cookie, _session, _param, _header];

    return this.chunks;
};
