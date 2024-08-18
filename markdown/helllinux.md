
---

I have forked minimal linux live and named my fork Hell Linux - https://github.com/su8/hellLinux

It comes with busybox 1.35.0, linux kernel 6.6.1, glibc 2.40.

Here's the kernel itself - ![](img/file/helllinux/pic.png)

```bash
git clone https://github.com/su8/hellLinux
cd src
chmod +x *.sh

#  grab some coffee and wait til it finishes
./build_minimal_linux_live.sh
./qemu-bios.sh

# to install it in a file:
sudo ./generate_hdd.sh -s 100MB
./write_to_media.sh hdd.img
qemu-system-x86_x64 -m 128M -hda hdd.img -boot d -vga std
```
