
---

Zip and unzip files only by using python and `zlib`.

```bash
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
```

And the unzip which you can make it on shell functoin too:

```bash
python3 -c"from zipfile import ZipFile;
with ZipFile('"$1"', 'r') as archive:
    print('\n'.join(' \033[1;95mextracted\033[0m: \033[1;94m{0}\033[0m'.format(x.filename)\
    for x in archive.infolist()));archive.extractall()"
```