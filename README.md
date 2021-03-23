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
this.sendNotification('CLEAR_NAGIOS_NOTIFICATIONS')
```

## Nagios Configuration

### Install Plugin

The included `mm_notify` Nagios Plugin is what sends the POST request notification from the Nagios server to the MagicMirror module.  Copy the plugin to your /nagios/libexec folder and make executable (`chmod 755 mm_notify`).

### Add MagicMirror to Nagios Config Files

This can be in any of the .cfg files that are loaded by Nagios.  Replace the IP address with your MagicMirror's IP address:port.

```properties
define command {
    command_name    notify_mm_service
    command_line    $USER1$/mm_notify http://192.168.1.100:8080/nagios service $HOSTNAME$ $SERVICEDESC$ $SERVICESTATE$ "$SERVICEOUTPUT$"
}

define command {
    command_name    notify_mm_host
    command_line    $USER1$/mm_notify http://192.168.1.100:8080/nagios host $HOSTNAME$ is_host $HOSTSTATE$ "$HOSTOUTPUT$"
}

define contact {
    contact_name                        magicmirror
    alias                               Magic Mirror
    service_notification_options        w,c,r
    host_notification_options           d,u,r
    service_notification_commands       notify_mm_service
    host_notification_commands          notify_mm_host
}

# Also, add to the definition of any hosts/services/groups that you want to be notified about:
#      contact         magicmirror

```
See [Nagios Documentation](https://www.nagios.org/documentation/) for details on installation and use of Nagios.
