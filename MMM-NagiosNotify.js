/* Magic Mirror
 * Module: NagoisNotify
 *
 * By: Andy Briggs
 * MIT Licensed.
 */

Module.register("MMM-NagiosNotify", {
    defaults: {

    },
    getStyles: function(){
        return ["MMM-NagiosNotify.css", "font-awesome.css"];
    },
    start: function(){
        Log.info("Starting module: " + this.name);
        this.title = "";
    },
    notificationReceived: function(notification, payload, sender){
        if(notification === "DOM_OBJECTS_CREATED") {
            this.sendSocketNotification("START");
        }
        if(notification === "CLEAR_NAGIOS_NOTIFICATIONS") {
            this.notifications = [];
            this.updateDom();
        }
    },
    socketNotificationReceived: function(notification, payload){
        if( payload.status === "OK" || payload.status === "UP") {
            this.removeNotification(payload);
        } else {
            this.addNotification(payload);
        }
    },
    addNotification: function(obj){
        let matching = this.notifications.filter( item => {
            return (item.host === obj.host && item.desc === obj.desc);
        });
        if( matching.length === 0 ){
            let newNotification = {
                type: obj.type,
                host: obj.host,
                status: obj.status,
                info: obj.info,
                desc: obj.desc,
            }
            this.notifications.push(newNotification);
            this.updateDom();
        }
    },
    removeNotification: function(obj){
        this.notifications = this.notifications.filter( item => {
            if ( item.type !== obj.type ) return true;
            if ( item.host !== obj.host ) return true;
            if ( item.desc !== obj.desc ) return true;
            return false;
        });
        this.updateDom();
    },
    notifications: [],
    getDom: function(){
        let wrapper = document.createElement('div');

        if ( this.notifications === undefined ) return wrapper;
        if ( this.notifications.length === 0 ) return wrapper;
        let self = this;
        let listContainer = document.createElement('ul');
        listContainer.classList.add("fa-ul");

        this.notifications.forEach( n => {
            let title = n.type === 'service' ? `${n.desc} on ${n.host}` : n.host;
            let className = (n.status === "WARNING" || n.status === "UNREACHABLE") ? "warning" : "critical";
            listContainer.appendChild(self.getRow(className, title, n.status, n.info));
        });
        wrapper.appendChild(listContainer);
        return wrapper;
    },
    getRow: function(className, title, status, info){
        let row = document.createElement('li');
        row.className = `row ${className}`;

        let icon = document.createElement('span');
        if ( status === "DOWN" || status === "CRITICAL" ) {
            icon.className = "fa-li fa fa-times-circle";
        } else {
            icon.className = "fa-li fa fa-exclamation-triangle";
        }
        row.appendChild(icon);

        let titleSpan = document.createElement('span');
        titleSpan.className = `title ${className} bright`;
        titleSpan.innerHTML = title;
        row.appendChild(titleSpan);

        let infoSpan = document.createElement('span');
        infoSpan.className = "info";
        infoSpan.innerHTML = info;
        row.appendChild(infoSpan);

        return row;
    }
});
