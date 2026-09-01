
---

Some of the network functions that I use and not rely on GUI network manager for my ether and wifi internet to bring both cards up/down.

FIle `network.zsh`:

```bash
#---------------------------------------------
# Bring the network card up with some
# random IP and MAC addresses assigned on it
#---------------------------------------------


bHz='192.168.10'
inftz='wlan0'
netmazk='24'
typeset -gA dT


netup() {
    __gen_rants

    sudo ip link set dev ${inftz} \
        address ${dT[fakemac]}

    __loop_until_ok \
        __gen_rants; \
        sudo ip link set dev ${inftz} \
            address ${dT[fakemac]}

    sudo ip link set dev ${inftz} up
    sudo ip addr add ${dT[addr]}/${netmazk} \
        broadcast ${dT[broadcast]} dev ${inftz}

    sudo ip route add default via ${dT[gateway]}
    sleep 2  # it takes some time to bring the NIC up
    sudo ip -family inet6 addr del \
        `ip a | gawk '/inet6/ {x=$2};END{print x}'` dev ${inftz}

    printf '%s\n' 'You are good to go.'

;}

netdown() {
    sudo ip addr flush dev ${inftz}
    sudo ip route flush dev ${inftz}
    sudo ip link set dev ${inftz} down

    sudo pkill dhcpcd
    sudo pkill dnsmasq
    sudo pkill dnscrypt-proxy
;}

netup2() {
  sudo ip link set eth0 down
  sudo ip link set wlan0 up
  sudo wpa_supplicant -c/etc/wifi.conf -iwlan0 -B
  sleep 5
  sudo dhcpcd wlan0
;}


# wifiup() {
#   sudo modprobe -a ath9k_htc
#   sudo wpa_supplicant -Dnl80211,wext -iwlan0 -c/etc/wpa.conf -B
#   sudo dhcpcd wlan0
# ;}

# ===================================================================
# systemd-networkd[907]: Event loop failed: Transport endpoint is not connected
# netctl fails shortly after you bridge or bond
# 2 or more NICs
# https://wiki.archlinux.org/index.php/Network_configuration#Static_IP_address
# 
# Wifi
# sudo emerge -a iw wireless-tools wpa_supplicant
# wpa_passphrase "NETWORK" "PASS"
# sudo nano /etc/wpa.conf
# sudo chmod -v 600 /etc/wpa.conf
# sudo wpa_supplicant -Dnl80211,wext -iwlan0 -c/etc/wpa.conf -B
```

And the other **zsh** file `non_interactive.zsh`:

```bash
# Is the given variable empty ?
__am_i_null() {
    if [[ -z $1 ]]
    then
        printf '%s\n' 'Houston, we have a problem'
        return 0 # __am_i_null ${var} && do_empty_thing || do_non_empty_thing
    else
        return 1
    fi
;}

# generate random internal (local) ip
# and some fake MAC addresses
__gen_rants() {
    for x in {1..2}
    do
        gen_addr=$[RANDOM%250]
        gen_mac=$(for x in {1..6};do printf '%02x:' $[RANDOM%256];done)
        gen_mac[18]=''
    done

    dT=(
        'addr'       "${bHz}.${gen_addr}"
        'broadcast'  "${bHz}.255"
        'gateway'    "${bHz}.254"
        'fakemac'    "${gen_mac}"
    )
}


# check the last program exit code status
# and repeat it until it exits with 0
# code meaning 'success'
__loop_until_ok() { while [[ $? != 0 ]]; do $@; done ;}
```