
---

I have created dead simple `cblogfy` (c) , `pblogfy` (perl) , `bblogfy` and `cppblogfy` static website generators.

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

    //snprintf(buf, sizeof(buf) - 1, "pandoc -s -f markdown -t html5 -o generated/%s/index.html -c style.css markdown/%s --metadata title='%s'", dir, entry->d_name, dir);
    snprintf(buf, sizeof(buf) - 1, "md2html markdown/%s --output=generated/%s/index.html", entry->d_name, dir);
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

And here is `cppblogfy`:

```cpp
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <algorithm>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <regex>
#include <unistd.h>
#include <dirent.h>
#include <cctype>
#include <fcntl.h>
#include <sys/stat.h>

#include "maddy/parser.h"

std::string mdToHtml(const std::string &mdInput);

std::string mdToHtml(const std::string &mdInput) {
    std::shared_ptr<maddy::ParserConfig> config = std::make_shared<maddy::ParserConfig>();
    std::istringstream markdownStream(mdInput);
    std::shared_ptr<maddy::Parser> parser = std::make_shared<maddy::Parser>(config);
    std::string htmlOutput = parser->Parse(markdownStream);
    return htmlOutput;
}

int main(void) {
  const std::filesystem::path generated{"generated"};
  const std::filesystem::path mdSrc{"markdown"};
  std::filesystem::create_directories(generated);
 
  for (auto const &dir_entry : std::filesystem::recursive_directory_iterator{mdSrc}) {
    if (dir_entry.path().filename().string() == "." || dir_entry.path().filename().string() == "..") continue;

    char genEntryDir[4096] = {'\0'};
    char writeToIndex[4096] = {'\0'};
    snprintf(genEntryDir, sizeof(genEntryDir) - 1, "generated/%s", dir_entry.path().filename().string().c_str());
    snprintf(writeToIndex, sizeof(writeToIndex) - 1, "%s/index.html", genEntryDir);
    std::string mdEntry = std::regex_replace(genEntryDir, std::regex(".md"), "");
    std::filesystem::create_directories(mdEntry);

    std::string openMd = "markdown/" + dir_entry.path().filename().string(); 
    std::ifstream openUpEntry(openMd);
    std::stringstream strStream;
    std::ofstream outdata;
    if(openUpEntry.is_open()) {
      strStream << openUpEntry.rdbuf();
      char *ptr = writeToIndex;
      char buf2[4096] = {'\0'};
      char *bufPtr = buf2;
      for (; *ptr; ptr++) {
        if (*ptr == '.' && *(ptr + 1) == 'm') { ptr++; ptr++; continue; }
        *bufPtr++ = *ptr;
      }
      *bufPtr = '\0';
      puts(buf2);
      outdata.open(buf2);
      if (!outdata) { puts("Could not open file for writing."); break; }
      outdata << mdToHtml(strStream.str()) << std::endl;
      outdata.close();
      
    }
    openUpEntry.close();
    genEntryDir[0] = '\0';
    writeToIndex[0] = '\0';
  }

  puts("Done");
  return EXIT_SUCCESS;
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
  md2html markdown/${x} --output=generated/${x%.md}/index.html
  #pandoc -s -f markdown -t html5 -o "generated/${x%.md}/index.html" -c style.css "markdown/${x}" --metadata title='...';
} done;
echo "Done"
```