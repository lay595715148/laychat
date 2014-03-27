var path = require('path');
var fs = require('fs');

/**
 * 
 */
function Requirer(classname) {
}

module.exports = exports = Requirer;

/**
 * @api private
 */
Requirer.inArray = function(k, arr, equal) {
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
};
/**
 * @api private
 */
Requirer.$ = function(modulename) {
    return require(modulename);
};
/**
 * @api private
 */
Requirer.require = function(classname) {
    var basepath = path.resolve(__dirname, '../');
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
//初始化类文件夹命名空间
(function define(space, dirpath) {
    var _path = dirpath;
    var _files = fs.readdirSync(_path);
    _files.map(function(f) {
        var _pathname = path.resolve(_path, f), _stat = fs.lstatSync(_pathname);
        if(_stat.isDirectory()) {
            space[f] = {};
            define(space[f], _pathname);
        } else if(_stat.isFile()) {
            var _ext = path.extname(f);
            var _name = path.basename(f, _ext);
            if(Requirer.inArray(_ext, Object.keys(require.extensions))) {
                space.__defineGetter__(_name, function() {
                    return eval('require(\'' + _pathname.replace(/\\/g, '/') + '\')');
                });
            }
        }
    });
})(Requirer.$, path.resolve(__dirname, '../'));

global.$ = global.$ || Requirer.$;//require() alias $()
global.$require = global.$require || Requirer.require;
