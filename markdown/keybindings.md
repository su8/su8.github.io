
---

Here are 2 ways that you can use to have key bindings support in your configuration file.

The first example uses `Option value` and the second example uses `Option=value`.

```cpp
struct Config {
  std::string server = "irc.libera.chat";
  int port = 6697;
  std::string nick = "Lunnis";
  std::string user = "Lunnis 0 * :GNU IRC Client";
  std::vector<std::string> channels = {"#ubuntu"};
  std::string logFile = "/tmp/0veric.log";
  std::string activeChannel = "#ubuntu";
};

int main(void) {
  Config cfg;
  loadConfig(cfg);
  return 0;
}

bool loadConfig(Config &cfg) {
  std::ifstream file((getenv("HOME") ? static_cast<std::string>(getenv("HOME")) + static_cast<std::string>("/") : static_cast<std::string>("./")) + ".0veric.conf");
  if (!file) return false;
  std::string key, value;
  while (file >> key >> value) {
    if (key == "server") cfg.server = value;
    else if (key == "port") cfg.port = std::stoi(value);
    else if (key == "nick") cfg.nick = value;
    else if (key == "channel") cfg.channels.push_back(value);
    else if (key == "logfile") cfg.logFile = value;
  }
  if (!cfg.channels.empty()) cfg.activeChannel = cfg.channels[0];
  return true;
}

```

And here is the second example:

```cpp
int main(void) {
  auto keys = loadKeyBindings((getenv("HOME") ? static_cast<std::string>(getenv("HOME")) : static_cast<std::string>(".")) + static_cast<std::string>("/0verau.conf"));
  return 0;
}

// Convert string to key code
int keyFromString(const std::string &val) {
  if (val == "ENTER") return '\n';
  if (val.size() == 1) return val[0];
  return -1; // Invalid
}

// Load key bindings from config file
std::unordered_map<std::string, int> loadKeyBindings(const std::string &configPath) {
  std::unordered_map<std::string, int> keys = {
    {"UP", 'i'}, {"DOWN", 'j'}, {"PLAY", 'o'}, {"SEEKLEFT", ','}, {"SEEKRIGHT", '.'}, {"NEXT_SONG", '&'}, {"PREVIOUS_SONG", '*'},
    {"PAUSE", 'p'}, {"QUIT", 'q'}, {"REPEAT", '@'}, {"SHOW_HIDE_ALBUM", '$'}, {"SHOW_HIDE_ONLINE_RADIO", '^'},
    {"SHUFFLE", '!'}, {"SEARCH", '/'}, {"VOLUMEUP", '+'}, {"VOLUMEDOWN", '-'}, {"SHOW_HIDE_ARTIST", '#'}, {"SHOW_HIDE_LYRICS", '%'},
  };
  std::ifstream file(configPath);
  if (!file.is_open()) { return keys; }
  std::string line;
  while (std::getline(file, line)) {
    if (line.empty() || line[0] == '#') continue; // Skip comments
    std::istringstream iss(line);
    std::string key, val;
    if (std::getline(iss, key, '=') && std::getline(iss, val)) {
      key.erase(remove_if(key.begin(), key.end(), ::isspace), key.end());
      val.erase(remove_if(val.begin(), val.end(), ::isspace), val.end());
      int code = keyFromString(val);
      if (code != -1) {
        keys[key] = code;
      } else {
        std::cerr << "Invalid key binding: " << key << "=" << val << "\n";
      }
    }
  }
  return keys;
}
```
