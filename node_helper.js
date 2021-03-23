"use strict";
/* Magic Mirror
 * Module: NagiosNotify
 */

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function(){
        var self = this;
        console.log("Starting node helper for: " + self.name);

        this.expressApp.post("/nagios/service/:host/:desc/:status", (req, res) => {
            let obj = {
                type: 'service',
                host: req.params.host,
                status: req.params.status,
                desc: req.params.desc,
                info: req.query.info
            };
            console.log(`Nagios sent a ${obj.type} notification for ${obj.type === 'service' ? (obj.desc + " on " ) : ""}${obj.host}: ${obj.status} -- ${obj.info}`);
            this.sendSocketNotification("NAGIOS_NOTIFICATION_RECEIVED", obj);
            res.status(200).send({status: 200});
        });

        this.expressApp.post("/nagios/host/:host/:status", (req, res) => {
            let obj = {
                type: 'host',
                host: req.params.host,
                status: req.params.status,
                desc: 'is_host',
                info: req.query.info
            };
            console.log(`Nagios sent a ${obj.type} notification for ${obj.type === 'service' ? (obj.desc + " on " ) : ""}${obj.host}: ${obj.status} -- ${obj.info}`);
            this.sendSocketNotification("NAGIOS_NOTIFICATION_RECEIVED", obj);
            res.status(200).send({status: 200});
        });
    }
});
