/**
 * 频道对象
 */
function Channel(id, name, layer) {
    if('object' === typeof id) {
        name = id.name;
        layer = id.layer;
        id = id.id;
    }
    if('undefined' === typeof id || isNaN(id)) {
        id = 0;
    }
    if('undefined' === typeof name) {
        name = '';
    }
    if('undefined' === typeof layer || isNaN(layer)) {
        layer = 0;
    }
    this.id = id;
    this.name = name;
    this.layer = layer;
    console.log('Channel construct');
}

Channel.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 通过频道ID生成频道对象
 * @param id
 * @param token
 * @returns {Channel}
 */
Channel.generateById = function(id, token) {
    // TODO
    return new Channel(id, 'global', 1);
};

module.exports = Channel;
