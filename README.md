# MMM-NagiosNotify

![Version](https://img.shields.io/github/package-json/v/pharmot/MMM-NagiosNotify)
![License](https://img.shields.io/github/license/pharmot/MMM-NagiosNotify)

This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror).  It displays notifications sent by a Nagios server via web request.  Notifications are displayed when a warning/critical/unreachable/down notification is sent and are cleared when an up/ok notification is sent for the same host and/or service.


## Installation
Navigate into your MagicMirror's `modules` folder and execute:
```bash
git clone https://github.com/pharmot/MMM-NagiosNotify.git
cd MMM-NagiosNotify
npm install
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

## Configuration options

There are currently no configurable options.

## Dependencies
Installed via `npm install`

- [url](https://www.npmjs.com/package/url)

## Nagios Server Configuration

1. Copy the `mm_notify` shell script to your Nagios server's libexec folder e.g. `/usr/local/nagios/libexec`
1. Make the file executable (`sudo chmod 755 mm_notify`)
1. Add a contact and commands to your Nagios config files (see example below)
1. Associate your MagicMirror contact with desired hosts and services.

```properties
# Example Nagios configuration
# (can be in any of the .cfg files that are loaded by Nagios)
#
# Commands are split into multiple lines for ease of reading.
# Combine into a single line in your actual configuration

define command {
    command_name    notify_mm_service
    command_line    $USER1$/mm_notify -m "http://192.168.0.100:8080" -t "service"
                        -h $HOSTNAME$ -d $SERVICEDESC$ -s $SERVICESTATE$ -i $SERVICEOUTPUT$
}

define command {
    command_name    notify_mm_host
    command_line    $USER1$/mm_notify -m "http://192.168.0.100:8080" -t "host"
                        -h $HOSTNAME$ -d "is_host" -s $HOSTSTATE$ -i $HOSTOUTPUT$
}

define contact {
    contact_name                        magicmirror
    alias                               Magic Mirror
    service_notification_options        w,c
    host_notification_options           d,u
    service_notification_commands       notify_mm_service
    host_notification_commands          notify_mm_host
}
```
See [Nagios Documentation](https://www.nagios.org/documentation/) for details on installation and use of Nagios.
