/**
 * New node file
 */
var User = require('./model/User');

function Laychat() {
    
}
/**
 * 
 * @param target object
 * @param msg string
 */
Laychat.send = function(form, to, msg) {
    if('object' == typeof to) {
        var u = new User();
        u.setName('lay');
        console.log('to is an object');
    } else {
        console.log('to isnot an object');
        return false;
    }
};

module.exports = Laychat;