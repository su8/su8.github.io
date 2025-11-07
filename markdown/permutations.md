
---

Creating permutations of given strings in a row:

```cpp
#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

std::vector<std::string> createPermutations(const std::string &str);

int main(int argc, char *argv[]) {
  for (int x = 1; x < argc; x++) {
    for (const auto &str : createPermutations(argv[x])) { std::cout << str << std::endl; }}
  return EXIT_SUCCESS;
}

std::vector<std::string> createPermutations(const std::string &str) {
  std::vector<std::string> result;
  if (str.empty()) {
    result.emplace_back("");
    return result;
  } 
  for (unsigned int x = 0; x < str.length(); x++) {
    std::string wholeStr = str.substr(0, x) + str.substr(x + 1);
    for (const auto &str2 : createPermutations(wholeStr)) { result.emplace_back(str[x] + str2); }
  }
  return result;
}
```

Running the program (`nitruks hello`) give us:

```bash
hello
helol
hello
helol
heoll
heoll
hlelo
hleol
hlleo
hlloe
hloel
hlole
hlelo
hleol
hlleo
hlloe
hloel
hlole
hoell
hoell
holel
holle
holel
holle
ehllo
ehlol
ehllo
ehlol
eholl
eholl
elhlo
elhol
ellho
elloh
elohl
elolh
elhlo
elhol
ellho
elloh
elohl
elolh
eohll
eohll
eolhl
eollh
eolhl
eollh
lhelo
lheol
lhleo
lhloe
lhoel
lhole
lehlo
lehol
lelho
leloh
leohl
leolh
llheo
llhoe
lleho
lleoh
llohe
lloeh
lohel
lohle
loehl
loelh
lolhe
loleh
lhelo
lheol
lhleo
lhloe
lhoel
lhole
lehlo
lehol
lelho
leloh
leohl
leolh
llheo
llhoe
lleho
lleoh
llohe
lloeh
lohel
lohle
loehl
loelh
lolhe
loleh
ohell
ohell
ohlel
ohlle
ohlel
ohlle
oehll
oehll
oelhl
oellh
oelhl
oellh
olhel
olhle
olehl
olelh
ollhe
olleh
olhel
olhle
olehl
olelh
ollhe
olleh
```