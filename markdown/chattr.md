
---

Locking and unlocking files with `chattr` that even `root` account can't remove them.

```bash
echo hello world > ch
sudo chattr +i ch
sudo rm -rf ch # will fail because the file is locked
sudo chattr -i ch
rm -rf ch # now it works
```
