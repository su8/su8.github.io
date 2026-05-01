
---

Managing your system configuration and home files has never been so easy, here I present to you 2 scripts to make your new pc configuration files copying so easy.

All you have to do is store the files like your system root partition and name your folders the same way like your root partition has named them.

The `install1` script:

```bash
#!/usr/bin/env bash

# set the correct ownership
chown_this() {
    chown --recursive root:root $1
    chmod 644 $1
}

# Find all files in the first argument and store them in an array
# Recursively create all subfolders if they do not exist
# and copy all array elements to their --> / <-- root directory
find_mkdir_cp() {
  filez_arr=(`find $1 -type f`)

  # replace 'frost' in all array elements with your $USER
  [[ ! -z $2 ]] && filez_arr=(${filez_arr[@]/frost/$2})

  for x in ${filez_arr[@]}
  do
    mkdir --parent "/${x%/*}"
    cp --recursive ${x} "/${x}"
    [[ -z $2 ]] && chown_this "/${x}"
  done
  unset x
}

find_mkdir_cp boot
find_mkdir_cp etc
chmod 600 '/etc/polkit-1/rules.d/50-udisks.rules'

find_mkdir_cp usr
```

The `install2` script:

```bash
#!/usr/bin/env bash
# DO NOT USE SUDO/SU !

# supply the 'find_mkdir_cp' function
source install1

find_mkdir_cp home $USER

# set the correct [d]irectory and [f]ile permissions
find_n_chmod() { find $HOME -type $1 -print0 | xargs -0 chmod $2 ;}

find_n_chmod d 700
find_n_chmod f 600
```

Scripts usage `sudo bash install1` and `bash install2`.