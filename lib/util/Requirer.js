var path = require('path');
var fs = require('fs');
var basepath = path.resolve(__dirname, '../');

module.exports = exports = global.$require = global.$require || Requirer;

/**
 * 
 */
function Requirer(classname) {
    return Requirer.require(classname);
}

Requirer.require = function(classname) {
    if($util.isString(classname)) {
        var exts = require.extensions;
        var pieces = classname.split('.');
        var arr = [];
        arr.push.call(arr, basepath);
        arr.push.apply(arr, pieces);
        var rpath = path.resolve.apply(this, arr);
        for(var ext in exts) {
            var whole = rpath + ext;
            if(fs.existsSync(whole)) {
                return require(rpath);
            }
        }
        return false;
    } else {
        return false;
    }
};

var $ = global.$ = {};
(function($) {
    var exts = require.extensions;
    var define = function(obj) {
        var _path = obj._path;
        
        var _files = fs.readdirSync(_path);
        _files.map(function(f) {
            var _pathname = path.resolve(_path, f), _stat = fs.lstatSync(_pathname);
            if(_stat.isDirectory()) {
                obj[f] = {};
                obj[f]._path = _pathname;
                define(obj[f]);
            } else if(_stat.isFile()) {
                var _ext = path.extname(f);
                var _name = path.basename(f, _ext);
                if($util.inArray(_ext, Object.keys(exts))) {
                    obj.__defineGetter__(_name, function() {
                        return eval('require(\'' + _pathname.replace(/\\/g, '/') + '\')');
                    });
                }
            }
        });
    };
    $._path = basepath;
    define($);
})($);
