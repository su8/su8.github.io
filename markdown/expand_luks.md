
---

Do you have encrypted file with LUKS and want to expand it ?

Here's how to do it.

```bash
# unmount and close your encrypted LUKS file before running the commands below
dd if=/dev/urandom bs=1MB count=700 iflag=fullblock | cat - >> encrypted_file.luks
sudo cryptsetup open --type luks encrypted_file.luks enc.luks
sudo e2fsck -f /dev/mapper/enc.luks
sudo resize2fs /dev/mapper/enc.luks
sudo cryptsetup close enc.luks
```
