function Model() {
}

module.exports = exports = Model;

/**
 * @abstract
 */
Model.prototype.table = function() {};
/**
 * @abstract
 */
Model.prototype.columns = function() {};
