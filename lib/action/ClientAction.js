var Collector = require('../util/Collector');
var Async = require('../util/Async');
var JAction = require('../action/JAction');
var Template = require('../template/Template');
var Prefacer = require('../prefacer/Prefacer');
var Service = require('../service/Service');
var Client = require('../model/Client');
var md5 = require('../util/MD5');

/**
 * 
 */
function ClientAction(req, res) {
    var name = $config.get('sign.action.client') || 'client';
    JAction.call(this, name, req, res);
}

$util.inherits(ClientAction, JAction);

module.exports = exports = ClientAction;

ClientAction.prototype.launch = function() {
    var me = this;
    var cservice = Service.factory('ClientService');
    var c = new Client();
    c.setClientId('lay' + Math.floor(Math.random() * 100000));
    c.setClientName('lay');
    c.setClientSecret(md5('clientSecret'));
    c.setClientType('webApp');
    c.setRedirectURI('http://localhost:8133/redirect');
    cservice.list(function(ret) {
        $logger.info(ret);
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};
