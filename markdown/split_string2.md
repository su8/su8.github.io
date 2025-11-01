
---

Do you use `memset()` over `snprintf()` function to **NUL** terminate strings properly ?

Here's I present the way to avoid wrong str splitting. The problematic way:

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <cctype>
#include <string>

int main(void) {
  unsigned short int y = 0U;
  unsigned short int z = 0U;
  char buf[4096] = {'\0'};
  char folders[100][4096] = {'\0'};
  char wordStr[] = "/home/user /usr /tmp";
  char *allptr = wordStr;
  char *bufptr = buf;
  for (; *allptr; allptr++) {
    if (std::isspace(*allptr)) { y++; continue; }
    *(bufptr++) = *allptr;
    snprintf(folders[y], sizeof(buf), "%s", buf);
  }
  for (; z <= y; z++) { std::cout << folders[z] << std::endl; }
  return EXIT_SUCCESS;
}
```

When you run it this happens:

```bash
/home/user
/home/user/usr
/home/user/usr/tmp
```

Yesterday I spent nearly 1 hour trying different ways to solve this issue and today I figure it out.

`snprintf(buf, sizeof(buf), "%s", "");` was not working the way I wanted and then in the search engine I saw `memset()` and solved this annoying bug right away.

All you have to do to solve the **bug** is:

```cpp
if (std::isspace(*allptr)) { y++; memset(buf, '\0', sizeof(buf)); bufptr = buf; continue; }
```

We explicitly **NUL** terminate all 4096 chars in `buf` and reset the `bufptr` pointer to the beginning of `buf`, so the next time we increase the pointer it starts from the first char and overwrite these **NUL** and we don't have to **NUL** terminate `buf` manually.

```cpp
  *(bufptr++) = *allptr;
  snprintf(folders[y], sizeof(buf), "%s", buf);
```