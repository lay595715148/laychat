var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JSAction = require('../action/JSAction');
var Template = require('../template/Template');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var User = require('../model/User');
var md5 = require('../util/MD5');

/**
 * 
 */
function CodeAction(req, res) {
    var name = $config.get('sign.action.admin.code') || 'admin_code';
    JSAction.call(this, name, req, res);
}

$util.inherits(CodeAction, JSAction);

module.exports = exports = CodeAction;

CodeAction.prototype.launch = function() {
    var me = this;
    var tservice = Service.factory('OAuth2CodeService');
    
    tservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};
