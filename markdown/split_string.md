
---

Here's 3 ways how to split string in tokens.

First way:

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
    if (std::isspace(*allptr)) { y++; memset(buf, '\0', sizeof(buf)); bufptr = buf; continue;}
    *(bufptr++) = *allptr;
    snprintf(folders[y], sizeof(buf), "%s", buf);
  }
  for (; z <= y; z++) { std::cout << folders[z] << std::endl; }
  return EXIT_SUCCESS;
}
```

2nd way:

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <cctype>
#include <string>
#include <regex>

int main(void) {
  unsigned short int y = 0U;
  unsigned short int z = 0U;
  char folders[100][4096] = {'\0'};
  std::string wordStr = "/home/user /usr /tmp";
  std::regex wRegex("\\S+");
  auto wBeg = std::sregex_iterator(wordStr.begin(), wordStr.end(), wRegex);
  auto wEnd = std::sregex_iterator();
  for (auto it = wBeg; it != wEnd; it++) { snprintf(folders[y++], 4096, "%s", it->str().c_str()); }
  for (; z < y; z++) { std::cout << folders[z] << std::endl; }
  return EXIT_SUCCESS;
}
```

And the third way:

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <cctype>
#include <string>
#include <regex>

int main(void) {
  unsigned short int y = 0U;
  unsigned short int z = 0U;
  char folders[256][4096] = {'\0'};
  std::string wordStr = "/home/user /usr /tmp";
  char *allptr = wordStr.data();
  char *token;
  while ((token = strtok_r(allptr, " ", &allptr))) { snprintf(folders[y++], 4096, "%s", token); }
  for (; z < y; z++) { std::cout << folders[z] << std::endl; }
  return EXIT_SUCCESS;
}
```