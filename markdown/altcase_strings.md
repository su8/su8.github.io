
---

Want to create different alternate casing regarding some strings ? Here's how to do it:

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <string>
#include <random>
#include <algorithm>

std::vector<std::string> variants(const std::string &word);

std::vector<std::string> variants(const std::string &word) {
  std::vector<std::string> result;
  result.push_back(word);

  // Capitalize the first letter of the word
  std::string capitalized = word;
  if (!capitalized.empty()) { capitalized[0] = static_cast<char>(toupper(capitalized[0])); }
  result.push_back(capitalized);

  // Convert the word to uppercase
  std::string upper = word;
  std::transform(upper.begin(), upper.end(), upper.begin(), ::toupper);
  result.push_back(upper);
  return result;
}

int main(void) {
  std::vector<std::string> usernames = {"frost"};
  std::vector<std::string> roles = {"user", "root"};
  std::vector<std::string> separators = {"", "_"};
  for (const auto &x : usernames) {
    for (const auto &z : roles) {
      for (const auto &sep : separators) {
        // Iterate over all combinations
        for (const auto &user : variants(x)) {
          for (const auto &role : variants(z)) { std::cout << user << sep << role << std::endl; }
        }
      }
    }
  }
  return EXIT_SUCCESS;
}
```

post edit:

I created a python version:

```python
import itertools

class Generate(object):
  def variants(self, word):
    return [word, word.capitalize(), word.upper()];

  def __init__(self):
    self.user = ['frost'];
    self.roles = ['user', 'root'];
    self.seperators = ['', '_'];
    for userName, r, sep in itertools.product(self.user, self.roles, self.seperators):
      for userz, rolez, in itertools.product(self.variants(userName), self.variants(r)):
        print(f"{userz}{sep}{rolez}\n");

if __name__ == '__main__':
  Generate();
```

And here's the output:

```bash
frostuser
frostUser
frostUSER
Frostuser
FrostUser
FrostUSER
FROSTuser
FROSTUser
FROSTUSER
frost_user
frost_User
frost_USER
Frost_user
Frost_User
Frost_USER
FROST_user
FROST_User
FROST_USER
frostroot
frostRoot
frostROOT
Frostroot
FrostRoot
FrostROOT
FROSTroot
FROSTRoot
FROSTROOT
frost_root
frost_Root
frost_ROOT
Frost_root
Frost_Root
Frost_ROOT
FROST_root
FROST_Root
FROST_ROOT
```