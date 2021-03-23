"use strict";
/* Magic Mirror
 * Module: NagiosNotify
 */

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
    start: function(){
        var self = this;
        console.log("Starting node helper for: " + self.name);
        this.expressApp.post("/nagiosnotify", (req, res) => {
            console.log(`[MMM-NagiosNotify] ${req.body.type} notification : ${req.body.type === 'service' ? (req.body.desc + " on " ) : ""}${req.body.host}: ${req.body.status} -- ${req.body.info}`);
            this.sendSocketNotification("NAGIOS_NOTIFICATION_RECEIVED", req.body);
            res.status(200).send(req.body);
        });
    }
});
