
---

Want to create different alternate casing regarding some strings ? Here's how to do it:

```cpp
#include <iostream>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <cctype>
#include <string>
#include <random>
#include <algorithm>
#include <iterator>

std::vector<std::string> variants(const std::string &word);

std::vector<std::string> variants(const std::string &word) {
  std::vector<std::string> result;
  result.emplace_back(word);
  std::string capitalized = word;
  if (!capitalized.empty()) { capitalized[0] = static_cast<char>(std::toupper(capitalized[0])); }
  result.emplace_back(capitalized);
  std::string upper = word;
  std::transform(upper.begin(), upper.end(), upper.begin(), [](unsigned char ch) { return std::toupper(ch); } );
  result.emplace_back(upper);
  return result;
}

int main(int argc, char *argv[]) {
  if (argc < 6) { return EXIT_SUCCESS; }
  std::vector<std::string> usernames = {"frost"};
  std::vector<std::string> roles = {"user", "root"};
  std::vector<std::string> separators = {"", "_"};
  if (argv[1][1] == 'f') { usernames = {argv[2]}; };
  if (argv[3][1] == 'o') { roles = {argv[4], argv[5]}; };
  for (const auto &x : usernames) {
    for (const auto &z : roles) {
      for (const auto &sep : separators) {
        for (const auto &user : variants(x)) { // Iterate over all combinations
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

On next day, here's the rust version:

```rust
use std::env;
use std::process;

fn variants(word: &str) -> Vec<String> {
    let mut result = Vec::new();
    result.push(word.to_string());
    if !word.is_empty() {
        let mut capitalized = word.to_string();
        if let Some(first_char) = capitalized.get_mut(0..1) { first_char.make_ascii_uppercase(); }
        result.push(capitalized);
    }
    result.push(word.to_uppercase());
    result
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 6 { process::exit(0); }
    let mut usernames = vec!["frost".to_string()];
    let mut roles = vec!["user".to_string(), "root".to_string()];
    let separators = vec!["".to_string(), "_".to_string()];
    if args[1].starts_with('-') && args[1].contains('f') { usernames = vec![args[2].clone()]; }
    if args[3].starts_with('-') && args[3].contains('o') { roles = vec![args[4].clone(), args[5].clone()]; }
    for username in &usernames {
        for role in &roles {
            for sep in &separators {
                for user in variants(username) {
                    for r in variants(role) {
                        println!("{}{}{}", user, sep, r);
                    }
                }
            }
        }
    }
}
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