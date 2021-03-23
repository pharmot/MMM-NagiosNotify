# MMM-NagiosNotify

![Version](https://img.shields.io/github/package-json/v/pharmot/MMM-NagiosNotify)
![License](https://img.shields.io/github/license/pharmot/MMM-NagiosNotify)

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror).  It displays notifications sent by a Nagios server via web request.  Notifications are displayed when a warning/critical/unreachable/down notification is sent and are cleared when an up/ok notification is sent for the same host and/or service.


## Installation
Navigate into your MagicMirror's `modules` folder and execute:

```bash
git clone https://github.com/pharmot/MMM-NagiosNotify.git
```

## Using the module

Add to the modules array in the `config/config.js` file:


```js
modules: [
    {
        module: 'MMM-NagiosNotify',
        position: 'top-right', //can be any region
        header: 'Nagios Notifications', //optional
    }
]
```

Existing notifications are cleared when Nagios sends a second notification with the status of "UP" (for hosts) or "OK" (for services).  To clear notifications manually, you can send a notification from another module (e.g. a remote control or menu module)

```js
this.sendNotification('CLEAR_NAGIOS_NOTIFICATIONS')`;
```


## Example Nagios Server Configuration

This can be in any of the .cfg files that are loaded by Nagios.  Replace the IP address with your MagicMirror's IP address (and port).  The host names and service names must be URL-friendly (i.e. no spaces, special characters, etc.).

```properties
define command {
    command_name    notify_mm_service
    command_line    /usr/bin/curl -X POST http://192.168.0.100:8080/nagios/service/$HOSTNAME$/$SERVICEDESCRIPTION$/$SERVICESTATE$?info=$(printf %s "$SERVICEOUTPUT$" | jq -sRr @uri)
}

define command {
    command_name    notify_mm_host
    command_line    /usr/bin/curl -X POST http://192.168.0.100:8080/nagios/host/$HOSTNAME$/$HOSTSTATE$?info=$(printf %s "$HOSTOUTPUT$" | jq -sRr @uri)
}

define contact {
    contact_name                        magicmirror
    alias                               Magic Mirror
    service_notification_options        w,c,r
    host_notification_options           d,u,r
    service_notification_commands       notify_mm_service
    host_notification_commands          notify_mm_host
}
```
See [Nagios Documentation](https://www.nagios.org/documentation/) for details on installation and use of Nagios.
