
---

There is a neat `archiso` script that can be used to create your own **Archlinux** distribution.

I just moved to `Arch` mirros from `Manjaro` in order to use `archiso` as the mirrors in `Manjaro` are not up-to-date like `Archlinux` are.

```bash
sudo pacman -Rdd pacman-mirrors
sudo rm -rf /etc/lsb-release
sudo pacman -S reflector
sudo reflector --protocol https --country "Germany" --latest 30 --number 20 --sort rate --save /etc/pacman.d/mirrorlist
cp -r /usr/share/archiso/config/releng archlive
sudo mkarchiso -v -w archlive -o . archlive/

# if running the same above command again:
sudo rm -rf archlive/x86_64/airootfs/lib/modules/6.10.5-arch-1/
```