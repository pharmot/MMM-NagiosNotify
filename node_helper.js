"use strict";
/* Magic Mirror
 * Module: NagiosNotify
 */

var NodeHelper = require("node_helper");
var url = require ("url");

module.exports = NodeHelper.create({
    start: function(){
        var self = this;
        console.log("Starting node helper for: " + self.name);

        this.expressApp.post("/notify/nagios", (req, res) => {
            var query = url.parse(req.url, true).query;
            this.sendSocketNotification("NAGIOS_NOTIFICATION_RECEIVED", query);
            res.status(200).send({status: 200});
        });
    }
});
