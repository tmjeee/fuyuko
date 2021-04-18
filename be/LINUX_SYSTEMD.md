# Installing BE as systemd service

### Files required
* `fuyuko-be.service` (systemd service unit)
* `fyuko-be-rsyslog.conf` (rsyslog configuration)
* `start-fuyuko-be.sh` (script that `fuyuko-be.service` called)

### Installation

* Create logs directory `sudo mkdir -p /var/logs/fuyuko`
* Stick `fuyuko-be.service` into `/etc/systemd/system` directory
* Stick `start-fuyuko-be.sh` into `/home/tmjee` or your home directory, mind you that if you the home directory needs to be the same as in `fuyuko-be.service`
* Stick `fuyuko-be-rsyslog.conf` into `/etc/rsyslog.d/`
* Change ownership of `/var/log/fuyuko/fuyuko-be.log` to `syslog:adm` using
```
 $> sudo chmod syslog:adm /var/log/fuyuko/fuyuko-be.log
```

To reload systemd after service unit file (`linux-systemd-fuyuko-be.service`) changed, run
```bash
$> sudo systemctl daemon-reload
```

To start / stop / restart service run the following respectively
```bash
$> sudo systemctl start
$> sudo systemctl stop 
$> sudo systemctl restart
```

To check journal use 
```bash
$> journalctl -e -u fuyuko
```

To see logs go inside directory `/var/logs/fuyuko`