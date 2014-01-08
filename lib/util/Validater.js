
exports = module.exports = Validater;

Validater.checkRequest = function(data) {
    if('undefined' == typeof data.session) {
        return false;
    }
    if('undefined' == typeof data.action) {
        return false;
    }
    if('undefined' == typeof data.content) {
        return false;
    }
    return true;
};

function Validater() {
}