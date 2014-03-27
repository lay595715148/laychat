var path = require('path');
var fs = require('fs');

var basepath = path.resolve(__dirname, '../');

function inArray(k, arr, equal) {
    equal = 'boolean' === typeof equal ? equal : true;
    return (function check(i) {
        if(i >= arr.length)
            return false;
        if(equal === true && arr[i] === k)
            return true;
        if(equal === false && arr[i] == k)
            return true;
        return check(i+1);
    }(0));
}
function $(modulename) {
    return require(modulename);
}

/**
 * 
 */
function Requirer(classname) {
    return Requirer.require(classname);
}

global.$ = global.$ || $;

global.$require = global.$require || Requirer;

module.exports = exports = {};

Requirer.require = function(classname) {
    if('string' === typeof classname) {
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
(function define(obj, dirpath) {
    var _path = dirpath || basepath;//|| obj._path //将_path属性去掉
    var _files = fs.readdirSync(_path);
    _files.map(function(f) {
        var _pathname = path.resolve(_path, f), _stat = fs.lstatSync(_pathname);
        if(_stat.isDirectory()) {
            obj[f] = {};
            //obj[f]._path = _pathname;
            define(obj[f], _pathname);
        } else if(_stat.isFile()) {
            var _ext = path.extname(f);
            var _name = path.basename(f, _ext);
            if(inArray(_ext, Object.keys(require.extensions))) {
                obj.__defineGetter__(_name, function() {
                    return eval('require(\'' + _pathname.replace(/\\/g, '/') + '\')');
                });
            }
        }
    });
})($);
