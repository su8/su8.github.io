
---

Some functions that I use and not rely on the file manager one, they are compression and extraction functions `extract.zsh` comes first:

```bash
#---------------------------------------------
# Archive(s) extraction functions
#---------------------------------------------

# extract.zsh
# The extraction function that does
# all the heavy lifting by using steroids
# and several other prohibited substances
__fucktard() {
    [[ "$(dirname $1)" == "." ]] && local dir_name="${PWD}" \
        || local dir_name="$(dirname $1)"

    local f_name="$(basename $1)"
    local temp_one="$(mktemp --directory --tmpdir XXXXXXX)"
    local temp_two="$(mktemp --directory --tmpdir=${temp_one} XXXXXXX)"

    mv $1 "${temp_two}" && cd "${temp_two}"

    case $2 in
        bz2-orig)  bunzip2 --verbose "${f_name}"              ;;
        gz-orig)   gunzip  --verbose "${f_name}"              ;;
        xz-orig)   unxz    --verbose "${f_name}"              ;;
        zip-orig)  python3 -c"from zipfile import ZipFile;
with ZipFile('"${f_name}"', 'r') as archive:
    print('\n'.join(' \033[1;95mextracted\033[0m: \033[1;94m{0}\033[0m'.format(x.filename)\
    for x in archive.infolist()));archive.extractall()"       ;;
        seven_zip) 7z x "${f_name}"                           ;;
        rar-orig)  unrar x "${f_name}"                        ;;
        lzop-orig) lzop --verbose --extract "${f_name}"       ;;
        lrz-orig)  lrzuntar -v "${f_name}"                    ;;
        tar-orig|lz4-orig)
                if [[ "$2" == "lz4-orig"  ]]
                then
                    lz4 --verbose --decompress "${f_name}"
                    f_name="${f_name%%.lz4}"
                fi
                if [[ "${f_name}" == *.tar ]]
                then
                    tar --skip-old-files \
                        --verbose --extract --file "${f_name}"
                fi                                         ;;
           # filter the archive through program $2(--xxx)
           *) tar --skip-old-files \
                  --verbose --extract $2 --file "${f_name}"  ;;
    esac
    # The more scenarios I can think of, `mv'
    # becomes true trouble maker. Let's leave
    # python to deal most common issues (if any)
    python2 -c"import os;from shutil import move,rmtree;
whos_here=os.listdir(os.getcwd());charge=os.path.join;
is_grenate=os.path.isfile;is_dynamite=os.path.isdir;defuse=os.remove;
for x in whos_here:
    say_what=charge('"${dir_name}"',x);
    if is_grenate(say_what):  defuse(say_what);
    if is_dynamite(say_what): rmtree(say_what);
[move(x,'"$dir_name"') for x in whos_here];"
    cd "${dir_name}" && rm -rf "${temp_one}"
;}

#--------------------------------------------------
# Extract single/multiple archives
# Lazy people: extract *
#--------------------------------------------------
extract() {
  for xXx in "$@"
  do
    if [[ -f $xXx ]]
    then
      # --bzip2, --gzip, --xz, --lzma, --lzop
      # are 'long' `tar' options standing for:
      # extract the archive and filter it
      # through program --xxx
      case $xXx in
         *.tar.bz2) __fucktard $xXx  --bzip2          ;;
         *.bz2)     __fucktard $xXx  bz2-orig         ;;
         *.t[zb]?*) __fucktard $xXx  --bzip2          ;;
         *.tar.gz)  __fucktard $xXx  --gzip           ;;
         *.gz)      __fucktard $xXx  gz-orig          ;;
         *.t[ag]z)  __fucktard $xXx  --gzip           ;;
         *.tz)      __fucktard $xXx  --gzip           ;;
         *.tar.xz)  __fucktard $xXx  --xz             ;;
         *.xz)      __fucktard $xXx  xz-orig          ;;
         *.txz)     __fucktard $xXx  --xz             ;;
         *.tpxz)    __fucktard $xXx  --xz             ;;
         *.lzma)    __fucktard $xXx  --lzma           ;;
         *.tlz)     __fucktard $xXx  --lzma           ;;
         *.tar)     __fucktard $xXx  tar-orig         ;;
         *.rar)     __fucktard $xXx  rar-orig         ;;
         *.zip)     __fucktard $xXx  zip-orig         ;;
         *.xpi)     __fucktard $xXx  zip-orig         ;;
         *.lz4)     __fucktard $xXx  lz4-orig         ;;
         *.lrz)     __fucktard $xXx  lrz-orig         ;;
         *.tar.lzo) __fucktard $xXx  --lzop           ;;
         *.lzo)     __fucktard $xXx  lzo-orig         ;;
         *.Z)       uncompress $xXx                   ;;
         *.7z)      __fucktard $xXx  seven_zip        ;;
         *.exe)     cabextract $xXx                   ;;
         *)                                           ;;
      esac
    fi
  done
  unset xXx
;}
```

And `compress.zsh`:

```bash
#-----------------------------------------------------------
# Create meatballs with the highest possible compression.
# The first entry will be used as archive name.
# You can compress multiple directories and files
# that doesn't belong to the current directory.
# Example:
# compresslz4 /var/log /usr/bin /usr/include $HOME/.xinitrc
# Mind that the archive will be created in the
# current working directory, so you need "write" permission.
#
#
# The best of all is that you can easily provide "compress"
# and "extract" action options in your file manager, no-brainer!
# See ~/.config/misc/my_thunar_plugin.zsh
# Right click 'n enjoy :}
#-----------------------------------------------------------

compresstar() { tar --verbose --dereference --create --file\
                 `basename $1`.tar "$@" ;}
compressxz()  { compresstar "$@"
                 xz --verbose --force -9 --extreme `basename $1.tar` ;}
compressgz()  { compresstar "$@"
                 __run_parallel pigz gzip $1 ;}
compressbz()  { compresstar "$@"
                 __run_parallel lbzip2 bzip2 $1 ;}
compresslz()  { compresstar "$@"
                 xz --verbose --force -9 --extreme \
                    --format=lzma `basename $1.tar` ;}
compresslz4() { compresstar "$@"
                 lz4 -vf9 `basename $1.tar`
                 rm `basename $1.tar` ;}
compresslzo() { compresstar "$@"
                 lzop --verbose --force -9 `basename $1.tar`
                 rm `basename $1.tar` ;}
compresslrz() { compresstar "$@"
                 lrzip --verbose --force -f -L 9 `basename $1.tar`
                 rm `basename $1.tar` }
compress7z()  { 7za a -mx=9 `basename $1`.7z "$@" ;}
# zlib is required for ZIP_DEFLATED
# compresszip 'dir1 dir2 dir3 file file1 file2'
# The quotes are mandatory for multiple entries.
compresszip() {
    python3 -c"import os;from zipfile import ZipFile,ZIP_DEFLATED;
ufo_obj='"$1"'.split(' ');the_list=list();path_join=os.path.join;
norm='\033[0m';blue='\033[1;94m';magenta='\033[1;95m';
def zip_filez():
  with ZipFile(os.path.basename(ufo_obj[0])+'.zip','a',ZIP_DEFLATED) as archive:
    [archive.write(x) for x in the_list];
    for x in the_list:
      x=(x if not x.startswith(os.sep) else x.replace(os.sep,str(),1));
      print(' {0}adding{1}: {2}{3}{1}'.format(magenta,norm,blue,x));
for x in ufo_obj:
  if os.path.isdir(x):
    for root,_,files in os.walk(x):
      for z in files:
         the_list.append(path_join(root,z));
  else:  the_list.append(x);
zip_filez();"
;}

tarhome() {
    # directories or files to exclude
    set -A snooP
    snooP=(
        $HOME/{.cache,.local,.gvfs,.dbus}
        "$HOME/.config/wine"
        "$HOME/.thumbnails"
)
    tar --dereference --sparse --one-file-system \
    --exclude-from=<(printf '%s\n' ${snooP[@]}) \
    --create --file "/tmp/home_${USER}_`date +%Y_%m_%d`.tar" \
    $HOME --totals
;}
```