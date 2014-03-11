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
