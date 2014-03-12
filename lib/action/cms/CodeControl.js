var Collector = $require('util.Collector');
var Async = $require('util.Async');
var JSAction = $require('action.JSAction');
var Template = $require('template.Template');
var Prefacer = $require('prefacer.Prefacer');
var Service = $require('service.Service');
var User = $require('model.User');
var md5 = $require('util.MD5');

/**
 * 
 */
function CodeControl(req, res) {
    var name = $config.get('sign.action.cms.code') || 'cms_code';
    JSAction.call(this, name, req, res);
}

$util.inherits(CodeControl, JSAction);

module.exports = exports = CodeControl;

CodeControl.prototype.launch = function() {
    var me = this;
    var tservice = Service.factory('OAuth2CodeService');
    
    tservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};
