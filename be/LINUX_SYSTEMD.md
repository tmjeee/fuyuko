# Installing BE as systemd service

* Create logs directory `sudo mkdir -p /var/logs/fuyuko`
* Stick `linux-systemd-fuyuko-be.service` into `/etc/systemd/system` directory
* Stick `linux-systemd-start-fuyuko-be.sh` into `/home/tmjee` or your home directory, mind you that if you the home directory needs to be the same as in `linux-systemd-fuyuko-be.service`

To reload systemd after unit file (`linux-systemd-fuyuko-be.service`) changed run
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