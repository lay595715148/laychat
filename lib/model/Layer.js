/**
 * 频道层对象
 */
function Layer() {
    this.id = 0;
    this.name = '';
}

module.exports = exports = Layer;

/**
 * 
 * @param id {Number}
 */
Layer.prototype.setId = function(id) {
    if('number' === typeof id)
        this.id = id;
};
/**
 * 
 * @param name {String}
 */
Layer.prototype.setName = function(name) {
    if('string' === typeof name)
        this.name = name;
};
