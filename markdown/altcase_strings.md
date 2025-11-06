
---

Generate alternate case from runtime strings. Perfect for generating permutations of credentials for testing or security auditing. Generates all possible combinations of a username and many roles with different casing styles and separators. It's useful for creating variations of strings, such as for password cracking tools like rainbow tables to be used by `john the ripper`.

## The new C++ version, written on the next day:

```cpp
/*
Copyright 11/05/2025 https://github.com/su8/nitruks
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
#include <cstdlib>
#include <iostream>
#include <string>
#include <algorithm>

int main(int argc, char *argv[]) {
  for (int x = 1; x < argc; x++) {
    std::string s = argv[x];
    while (std::next_permutation(s.begin(), s.end())) { std::cout << s << std::endl; }
  }
  return EXIT_SUCCESS;
}
```

## The old C++ version:

```cpp
/*
Copyright 11/05/2025 https://github.com/su8/nitruks
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

int main(int argc, char *argv[]) {
  if (argc < 6) { return EXIT_FAILURE; }
  std::vector<std::string> usernames = { "frost" };
  std::vector<std::string> roles;
  std::vector<std::string> separators = { "", "_" };
  if (argv[1][1] == 'f') { usernames = { argv[2]}; };
  if (argv[3][1] == 'o') { for (unsigned int x = argc - 1U; x >= 4U ; x--) { roles.emplace_back( argv[x] ); } };
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
```

## The new python version

## Python version of nitruks

```python
import sys;
import itertools;

class Generate(object):
    def __init__(self):
        self.roles = [x for x in sys.argv[1:]];
        str2 = set();
        for x in self.roles:
            for z in itertools.permutations(x, len(x)):
                str2.add(z);
        print("{0}".format(''.join(list(itertools.chain(*str2)))));
if __name__ == '__main__':
    Generate();

# And use it like this: python main.py hello world
```

post edit:

## I created a python version (OLD ONE):

```python
import sys;
import itertools;

class Generate(object):
    def variants(self, word):
        return [word, word.capitalize(), word.upper()];

    def __init__(self):
        if len(sys.argv) < 4:
            sys.exit(1);
        self.user = [];
        if sys.argv[1][1] == 'f':
            self.user.append(sys.argv[2]);
        self.roles = [];
        self.seperators = ['', '_'];
        if sys.argv[3][1] == 'o':
            self.roles = [x for x in sys.argv[4:]];
        for userName, r, sep in itertools.product(self.user, self.roles, self.seperators):
            for userz, rolez in itertools.product(self.variants(userName), self.variants(r)):
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
    if args.len() < 6 { process::exit(1); }
    let mut usernames = vec!["frost".to_string()];
    let mut roles = Vec::new();
    let separators = vec!["".to_string(), "_".to_string()];
    if args[1].starts_with('-') && args[1].contains('f') { usernames = vec![args[2].clone()]; }
    if args[3].starts_with('-') && args[3].contains('o') { for x in (4..args.len()).rev() { roles.push(args[x].clone()); } }
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

`Makefile`:

```makefile
#   11/05/2025 https://github.com/su8/nitruks
#   This program is free software; you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation; either version 2 of the License, or
#   (at your option) any later version.

#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.

#   You should have received a copy of the GNU General Public License
#   along with this program; if not, write to the Free Software
#   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#   MA 02110-1301, USA.

CFLAGS+=-g2 -Wall -Wextra -O2 -std=c++17 -D_DEFAULT_SOURCE -pipe -pedantic -Wundef -Wshadow -W -Wwrite-strings -Wcast-align -Wstrict-overflow=5 -Wconversion -Wpointer-arith -Wformat=2 -Wsign-compare -Wendif-labels -Wredundant-decls -Winit-self
LDFLAGS+=
PACKAGE=nitruks
PROG=main.cpp

all:
	$(CXX) -o $(PACKAGE) $(PROG) $(CFLAGS) $(LDFLAGS)

install: 
	install -D -s -m 755 $(PACKAGE) /usr/bin/$(PACKAGE)

clean:
	rm -f $(PACKAGE)

uninstall:
	rm -f /usr/bin/$(PACKAGE)

.PHONY: all install clean uninstall
```