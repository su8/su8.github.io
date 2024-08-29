
---

I have created dead simple `cblogfy` (c) , `pblogfy` (perl) and `bblogfy` static website generators.

They rely on `jblogfy` code.

Here's the `cblogfy` code:

```c
/*
   08/29/2024 https://github.com/su8/cblogfy
 
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2 of the License, or
   (at your option) any later version.
 
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
 
   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
   MA 02110-1301, USA.
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <dirent.h>
#include <unistd.h>

int main (void) {
  DIR *dp = NULL;
  char buf[4096] = {""};
  char dir[4096] = {""};
  char *dirPtr = dir;
  struct stat st = {0};
  struct dirent *entry = NULL;     

  if (NULL == (dp = opendir("markdown"))){
    goto err;
  }
  snprintf(buf, sizeof(buf) - 1, "generated");
  if (stat(buf, &st) == -1) mkdir(buf, 0700);

  while ((entry = readdir(dp))) {
    if (*(entry->d_name) == '.') continue;

    dirPtr = dir;
    for (char *entryPtr = entry->d_name; *entryPtr; entryPtr++) {
      if (*entryPtr == '.' && *(entryPtr+1) == 'm') break;
      *dirPtr++ = *entryPtr;
    }
    *dirPtr = '\0';

    snprintf(buf, sizeof(buf) - 1, "generated/%s", dir);
    if (stat(buf, &st) == -1) mkdir(buf, 0700);

    snprintf(buf, sizeof(buf) - 1, "pandoc -s -f markdown -t html5 -o generated/%s/index.html -c style.css markdown/%s --metadata title='%s'", dir, entry->d_name, dir);
    system(buf);
    buf[0] = '\0';
    dir[0] = '\0';
  }
  if ((closedir(dp)) == -1) {
    goto err;
  }
  return EXIT_SUCCESS;
 
err:
  return EXIT_FAILURE;
}

```

And here is the `pblogfy.pl` code:

```perl
# 08/28/2024 https://github.com/su8

# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.

# whereis cpan
# sudo cpan install Text::Markdown File::Find

use strict;
use warnings;

use File::Copy;
use List::Util qw(any);
use Text::Markdown 'markdown';
use File::Find;


sub re_read {
  my ($filename) = @_;
  my $fh;

  open($fh, '<:encoding(UTF-8)', $filename)
    or die "Could not open file '$filename' $!";
  local $/ = undef; # <--- slurp mode
  my $concatArr = <$fh>;
  close($fh);

  return $concatArr;
}

sub re_write {
  my ($filename,$concatArr) = @_;
  my $fh;

  open($fh, '>:encoding(UTF-8)', $filename) 
    or die "Could not open file '$filename' $!";

  print $fh $concatArr;
  close($fh);
  return;
}

sub getPosts {
    my ($dir) = @_;
    my @files;
    find(sub { push @files, $_ }, $dir);
    return @files
}



{
  mkdir ("generated", 0700) unless (-d "generated");
  for my $x (getPosts("markdown"))
  {
    my $post = "generated/$x";
    $post =~ s/.md//;
    mkdir ($post,0700) unless (-d $post);
    if ($x ne ".") {
      my $html = markdown(re_read("markdown/$x"));
      re_write("$post/index.html", $html);
    }
  }

  print "Done\n";
}
```

And here is the last, but not least `bblogfy`:

```bash
# 08/29/2024 https://github.com/su8/bblogfy

# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301, USA.

for x in `ls -a markdown`; do {
  if [[ $x == "." || $x == ".." ]]; then
    continue;
  fi
  mkdir -p "generated/${x%.md}";
  pandoc -s -f markdown -t html5 -o "generated/${x%.md}/index.html" -c style.css "markdown/${x}" --metadata title='...';
} done;
echo "Done"
```