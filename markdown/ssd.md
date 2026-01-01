
---


Did you know that you can improve the speed of your SSD by turninng the following options on in : `/etc/fstab` ?

```bash
/dev/sda2		/		ext4		discard,noatime		0 1
```

Then run `sudo fstrim /`.