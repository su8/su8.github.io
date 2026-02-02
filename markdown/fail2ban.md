
---

In this tutorial I will show you how to install and configure fail2ban which helps to stop and reduce brute forcing `ssh` attacks.

First things first:

```bash
sudo apt update
sudo apt install ssh fail2ban
```

The fail2ban configurations reside in `/etc/fail2ban`. We want to prevent brute forcing attemps so we copy one config and tweak it:

```bash
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Append somewhere in the config a

```python
[ssh]
enabled = true
port = ssh
filter = sshd
maxretry = 3
findtime = 5m
bantime = 24h
```

And enable and start the both services:

```
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

Connect to your ssh device and input the wrong password, then the correct one and see what happens in the `log` file:

```bash
sudo tail -f /var/log/fail2ban.log
```

To unban some IP type `sudo fail2ban-client set sshd unbanip 192.168.10.1`