
---

![](img/file/hackzy/snap.png)

Terminal & **GUI** hacker game. For the GUI version compile it according to the README.md docs below.

## Installation

Tested with [Visual Studio Code Editor](https://code.visualstudio.com/download), but you need to install [MingW](https://github.com/niXman/mingw-builds-binaries/releases/download/12.2.0-rt_v10-rev0/x86_64-12.2.0-release-posix-seh-rt_v10-rev0.7z), once downloaded extract it to **C:\MingW**, then re-open [Visual Studio Code Editor](https://code.visualstudio.com/download), you might want to install C\C++ extensions if you plan to write C\C++ code with the editor. If you plan to contribute to this project go to **File->Preferences->Settings** and type to search for **cppStandard** and set it to c17 to both C++ and C.

I use **One Monokai** theme for the [VScode Editor](https://code.visualstudio.com/download)

In [Visual Studio Code Editor](https://code.visualstudio.com/download), go to **Terminal->Configure Tasks...->Create tasks.json from template** and copy and paste this into it:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
        "type": "cppbuild",
        "label": "C/C++",
        "command": "C:\\MingW\\bin\\g++.exe",
        "args": [
            "-fdiagnostics-color=always",
            "-std=c++17",
            "-ggdb",
            "-lpthread",
            "-Wall",
            "-Wextra",
            "-O2",
            "-pipe",
            "-pedantic",
            "-Wundef",
            "-Wshadow",
            "-W",
            "-Wwrite-strings",
            "-Wcast-align",
            "-Wstrict-overflow=5",
            "-Wconversion",
            "-Wpointer-arith",
            "-Wformat=2",
            "-Wsign-compare",
            "-Wendif-labels",
            "-Wredundant-decls",
            "-Winit-self",
            "${file}",
            "-o",
            "${fileDirname}/${fileBasenameNoExtension}"
        ],
        "options": {
            "cwd": "C:\\MingW\\bin"
        },
        "problemMatcher": [
            "$gcc"
        ],
        "group": {
            "kind": "build",
            "isDefault": true
        },
        "detail": "compiler: C:\\MingW\\bin\\g++.exe"
    }
]
}
```

File `Makefile`:

```bash
#   05/24/2022
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

CFLAGS+=-Wall -Wextra -O2 -std=c++17 -pipe -pedantic -Wundef -Wshadow -W -Wwrite-strings -Wcast-align -Wstrict-overflow=5 -Wconversion -Wpointer-arith -Wformat=2 -Wsign-compare -Wendif-labels -Wredundant-decls -Winit-self
SRCS=main.cpp
PROGS=hackzy
BIN_DIR=/usr/bin

all:
	$(CXX) $(CFLAGS) -o $(PROGS) $(SRCS) -lpthread

install: 
	install -D -s -m 755 $(PROGS) $(BIN_DIR)/$(PROGS)

uninstall:
	rm -f $(BIN_DIR)/$(PROGS)

clean:
	rm -f $(PROGS)

.PHONY: all install clean uninstall
```

File `main.c`:

```c
/*
  05/24/2022 https://github.com/su8/hackzy
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
#include <ctime>
#include <sys/types.h>
#include <unistd.h>
#include <cstdio>
#include <string>
#include <cstdlib>
#include <cstring>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <thread>
#include <cctype>
#include <regex>
#include <random>

static void do_ls(const std::string &str);
static void do_help(const std::string &str);
static void do_cat(const std::string &str);
static void do_scan(const std::string &str);
static void do_ssh(const std::string &str);
static void do_crackssh(const std::string &str);
static void do_crackfw(const std::string &str);
static void do_bank(const std::string &str);
static void do_crypto(const std::string &str);
static void do_analyze(const std::string &str);
static void do_solve(const std::string &str);
static void do_forkbomb(const std::string &str);
static void do_upgrade(const std::string &str);
static void do_addIp(const std::string &str);
static void do_addNote(const std::string &str);
static void do_replace(const std::string &str);
static void do_delNotes(const std::string &str);
static void do_history(const std::string &str);
static void do_uname(const std::string &str);
static void do_date(const std::string &str);
static inline void processInput(const std::string &str);
static inline void trimQuotes(char *bufPtr, const char *strPtr);
static void updateCrypto(void);
static unsigned short int checkForkBomb(const std::string &str);
static unsigned short int checkFwSsh(const std::string &key);

struct Opt
{
    const char *cmd;
    void (*my_func)(const std::string &str);
};

static const struct Opt opt[] = {
    {"ls", do_ls},
    {"help", do_help},
    {"cat", do_cat},
    {"scan", do_scan},
    {"ssh", do_ssh},
    {"crackfw", do_crackfw},
    {"crypto", do_crypto},
    {"bank", do_bank},
    {"analyze", do_analyze},
    {"solve", do_solve},
    {"forkbomb", do_forkbomb},
    {"crackssh", do_crackssh},
    {"addip", do_addIp},
    {"addnote", do_addNote},
    {"replace", do_replace},
    {"delnotes", do_delNotes},
    {"history", do_history},
    {"uname", do_uname},
    {"date", do_date},
    {"upgrade", do_upgrade}};

static std::string IP = "1.1.1.1";
static unsigned long int MONEY = 0U;
static short int ConnectCrackDelay = 5;

static std::vector<std::string> ipArr = {
    "1.1.1.1",
    "44.55.66.77",
    "123.456.789.000",
    "noIP"};
static const std::vector<std::string> Missions               = {
    "scan",
    "addip ip",
    "crackssh ip",
    "crackfw ip",
    "crypto ip",
    "bank"};

static std::unordered_map<std::string, unsigned short int> ipCracked   = { {ipArr[0], 1U} };
static std::unordered_map<std::string, unsigned short int> ipFwCracked = { {ipArr[0], 1U} };
static std::unordered_map<std::string, unsigned short int> ipCrypto    = { {ipArr[0], 0U} };
static std::unordered_map<std::string, unsigned short int> ipForkBomb  = { {ipArr[0], 0U} };
static std::unordered_map<std::string, std::string> ipSolved           = { {ipArr[0], ""} };
static std::unordered_map<std::string, std::string> NOTES              = { {ipArr[0], ""} };
static std::vector<std::string> History                                = {                };

int main(void)
{
    unsigned short int ipArrSize = static_cast<unsigned short int>(ipArr.size());
    for (unsigned short int x = 1U; x < ipArrSize; x++) {
        ipCracked.emplace(ipArr[x], 0U);
        ipFwCracked.emplace(ipArr[x], 0U);
        ipCrypto.emplace(ipArr[x], 0U);
        ipForkBomb.emplace(ipArr[x], 0U);
        ipSolved.emplace(ipArr[x], "");
        NOTES.emplace(ipArr[x], "");
    }
    puts("Type 'help' to see the available commands");

    while (1)
    {
        for (const auto &key : Missions)
        {
            std::cout << key << '\n' << std::flush;
        }

        std::string userInput;
        std::cout << "frost@localhost " << IP << " > " << std::flush;
        getline(std::cin, userInput);

        if (userInput.empty())
        {
            continue;
        }

        if (userInput == "exit")
        {
            break;
        }

        History.emplace_back(userInput);
        processInput(userInput);
    }

    return EXIT_SUCCESS;
}

static inline void processInput(const std::string &str)
{
    unsigned short int x = 0U;
    char buf[128] = {'\0'};
    char cmd[10] = {'\0'};
    char matchCmd = 0;
    const char *strPtr = str.c_str();
    char *cmdPtr = cmd;

    for (x = 0U; x < 9U && *strPtr; x++, strPtr++)
    {
        if (*strPtr == ' ')
        {
            strPtr++;
            break;
        }
        *cmdPtr++ = *strPtr;
    }
    *cmdPtr = '\0';

    for (x = 0U; x < sizeof(opt) / sizeof(opt[0]); x++)
    {
        if (!(strcmp(opt[x].cmd, cmd)))
        {
            matchCmd = 1;
            break;
        }
    }

    if (matchCmd == 0)
    {
        std::cout << "No such command " << str << '\n' << std::flush;
        return;
    }

    trimQuotes(buf, strPtr);
    opt[x].my_func(static_cast<std::string>(buf));
}

static inline void trimQuotes(char *bufPtr, const char *strPtr)
{
    for (unsigned short int x = 0U; x < 127U && *strPtr; x++, strPtr++)
    {
        if (*strPtr == '"' || *strPtr == '\'')
        {
            continue;
        }

        *bufPtr++ = *strPtr;
    }
    *bufPtr = '\0';
}

static void do_cat(const std::string &str)
{
    if (str != "notes.txt")
    {
        std::cout << "No such " << str << " file\n";
        return;
    }
    
    for (const auto &[key, val] : NOTES)
    {
        if (key == IP)
        {
            std::cout << val << std::flush;
            break;
        }
    }
}

static void do_scan(const std::string &str)
{
    static_cast<void>(str);
    for (const auto &key : ipArr)
    {
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        std::cout << key << '\n' << std::flush;
    }
}

static void do_ssh(const std::string &str)
{
    char foundIt = 0;

    if (str.empty())
    {
        puts("You need to provide IP");
        return;
    }

    if (checkForkBomb(str) == 1U)
    {
        return;
    }

    for (const auto &[key, val] : ipFwCracked)
    {
        if (key != str)
        {
            continue;
        }

        if (checkFwSsh(key) == 1U)
        {
            return;
        }

        foundIt = 1;
        std::cout << "Connected to: " << str << '\n' << std::flush;
        IP = str;
        break;
    }

    if (foundIt == 0)
    {
        std::cout << "The given ip " << str << " does not exist\n" << std::flush;
    }
}

static void do_analyze(const std::string &str)
{
    unsigned short int x = 50U;
    unsigned short int z = 50U;
    unsigned short int w = 0U;
    char foundIt = 0;
    char buf[30] = {'\0'};
    char *bufPtr = buf;
    static const char alphas[] = "abcdefghijklmnopqrstuvwxyz";
    std::string keyStr = "";
    std::random_device rd;
    std::uniform_int_distribution<int> udist(0, 26);

    if (str.empty())
    {
        puts("You need to provide IP");
        return;
    }

    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    if (checkForkBomb(str) == 1U)
    {
        return;
    }

    for (const auto &[key, val] : ipFwCracked)
    {
        if (key != str)
        {
            continue;
        }

        foundIt = 1;
        keyStr = key;
        break;
    }

    if (foundIt == 0)
    {
        std::cout << "The given ip " << str << " does not exist\n" << std::flush;
        return;
    }

    for (x = 50U; x < 256U; x++, z++)
    {
        if (z & 1U)
        {
            putchar('1');
            *bufPtr = alphas[udist(rd)];
            putchar(*bufPtr++);
            if (w++ > 28U)
            {
                break;
            }
        }
        else
        {
            putchar('0');
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
            fflush(stdout);
        }

        z >>= static_cast<unsigned short int>(1U);
    }
    *bufPtr = '\0';

    ipSolved[keyStr] = static_cast<std::string>(buf);
    putchar('\n');
}

static void do_solve(const std::string &str)
{
    unsigned short int x = 0U;
    char foundIt = 0;
    char buf[10] = {'\0'};
    char *bufPtr = buf;
    const char *strPtr = str.c_str();

    if (str.empty())
    {
        puts("You need to provide key@IP");
        return;
    }

    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    for (; *strPtr && x < 9U; strPtr++, x++)
    {
        if (*strPtr == '@')
        {
            strPtr++;
            break;
        }
        *bufPtr++ = *strPtr;
    }
    *bufPtr = '\0';

    std::string bufStr = static_cast<std::string>(buf);
    for (const auto &[key, val] : ipSolved)
    {
        if (val != bufStr)
        {
            continue;
        }

        ipFwCracked[key] = 1U;
        ipCracked[key] = 1U;
        foundIt = 1;
        break;
    }

    if (foundIt == 0)
    {
        std::cout << "The given key@ip " << str << " does not exist\n" << std::flush;
        return;
    }

    std::cout << "Successfully solved the key for " << str << '\n' << std::flush;
}

static void do_forkbomb(const std::string &str)
{
    char foundIt = 0;

    if (str.empty())
    {
        puts("You need to provide IP");
        return;
    }

    if (str == "noIP")
    {
        puts("You can't execute a fork bomb for 'noIP'");
        return;
    }

    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    for (const auto &[key, val] : ipForkBomb)
    {
        if (key != str)
        {
            continue;
        }

        if (checkFwSsh(key) == 1U)
        {
            return;
        }

        if (val == 1U)
        {
            std::cout << "The pc " << key << " is down due to a fork bomb\n" << std::flush;
            return;
        }

        if (key == IP)
        {
            IP = "noIP";
        }
        foundIt = 1;
        ipForkBomb[key] = 1U;
        break;
    }

    if (foundIt == 0)
    {
        std::cout << "The given ip " << str << " does not exist\n" << std::flush;
        return;
    }

    std::cout << "Successfully executed a fork bomb for " << str << '\n' << std::flush;
}

static void do_upgrade(const std::string &str) {
    if (str.empty())
    {
        puts("You need to provide what PC part you want to upgrade. Currently we have available upgrades only for the 'cpu'.");
        return;
    }

    if (str == "cpu" || str == "CPU" || str == "Cpu"
      || str == "cPu" || str == "cpU" || str == "cPU" || str == "CPu")
    {
        if (ConnectCrackDelay == 5 && MONEY >= 10U)
        {
            ConnectCrackDelay = 1;
            MONEY -= 10U;
            puts("Successfully purchased a CPU upgrade");
            return;
        }
        else if (ConnectCrackDelay == 1)
        {
            puts("You already upgraded the CPU.");
        }
        else if (MONEY < 10U)
        {
            puts("You don't have $10 which are needed to upgrade your CPU.");
        }
    }
    else
    {
        std::cout << "We don't have any upgrades for this pc part " << "'" << str << "'" << '\n' << std::flush;
    }
}

static void do_addIp(const std::string &str)
{
    unsigned short int z = static_cast<unsigned short int>(str.length());
    char toAddIp = 1;
    const char *strPtr = str.c_str();

    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    for (unsigned short int x = 0U; x < z; x++, strPtr++)
    {
        unsigned char cStrPtr = static_cast<unsigned char>(*strPtr);
        if ((!(isdigit(cStrPtr)) && *strPtr == '.') || isdigit(cStrPtr))
        {
            continue;
        }
        else
        {
            toAddIp = 0;
            break;
        }
    }

    if (toAddIp == 0)
    {
        std::cout << "The given IP address " << str << " can't be added because it contains letters or it's empty.\n" << std::flush;
        return;
    }

    if (ipCrypto.count(str))
    {
        std::cout << "The given ip " << str << " already exist, no further actions will be taken.\n" << std::flush;
        return;
    }

    ipArr.emplace_back(str);
    ipFwCracked.emplace(str, 0U);
    ipCracked.emplace(str, 0U);
    ipCrypto.emplace(str, 0U);
    NOTES.emplace(str, "");
    ipForkBomb.emplace(str, 0U);
    std::cout << "Successfully added " << str << " to the IP database, now you can deploy a crypto miner bot to this IP.\n" << std::flush;
}

static void do_addNote(const std::string &str)
{
    for (const auto &[key, val] : NOTES)
    {
        if (key == IP)
        {
            NOTES[key] += str + '\n';
            puts("Done.");
            break;
        }
    }
}

static void do_replace(const std::string &str)
{
    unsigned short int strLen = static_cast<unsigned short int>(str.length());
    char foundIt = 0;
    char gotFirstStr = 0;
    char buf1[128] = {'\0'};
    char buf2[128] = {'\0'};
    char *bufPtr1 = buf1;
    char *bufPtr2 = buf2;
    const char *strPtr = str.c_str();

    for (unsigned short int x = 0U; x < strLen && x < 127U; x++)
    {
        if (gotFirstStr == 0)
        {
            if (*strPtr == ' ')
            {
                gotFirstStr = 1;
                strPtr++;
                continue;
            }
            *bufPtr1++ = *strPtr++;
        }
        else
        {
            *bufPtr2++ = *strPtr++;
        }
    }
    *bufPtr1 = '\0';
    *bufPtr2 = '\0';

    for (const auto &[key, val] : NOTES)
    {
        if (key == IP)
        {
            if (NOTES[key].find(buf1) != std::string::npos)
            {
                NOTES[key] = std::regex_replace(NOTES[key], std::regex(buf1), buf2);
                foundIt = 1;
                puts("Done.");
                break;
            }
        }
    }

    if (foundIt == 0)
    {
        std::cout << "We couldn't find a text within your notes.txt to replace " << "' " << str << " '" << '\n' << std::flush;
    }
}

static void do_delNotes(const std::string &str)
{
    if (str.empty())
    {
        NOTES[IP] = "";
    }
    else if (!(NOTES.count(str)))
    {
        std::cout << "No such IP address " << str << '\n' << std::flush;
        return;
    }
    else
    {
        NOTES[str] = "";
    }
    puts("Done.");
}

static void do_history(const std::string &str)
{
    static_cast<void>(str);
    for (const auto &key : History)
    {
        std::cout << key << '\n' << std::flush;
    }
}

static void do_uname(const std::string &str)
{
    static_cast<void>(str);
    static const char uname[] = "Linux localhost 5.10.52-gentoo SMP Sun October 30 6:56 PM CEST x86_64 Intel i9-13900K GNU/Linux";
    std::cout << uname << '\n' << std::flush;
}

static void do_date(const std::string &str)
{
    static_cast<void>(str);
    char time_str[128];
    time_t t = 0;
    struct tm *taim = NULL;

    if ((t = time(NULL)) == -1 || (taim = localtime(&t)) == NULL ||
      (strftime(time_str, 128, "%d %m %Y %I:%M %p", taim)) == 0) {
  
        std::cout << "Time failed!\n" << std::flush;
        return;
    }

    std::cout << time_str << std::endl;
}

#define CRACK_PROGRAM(function, dicti, msg1, msg2, msg3, launchCrypto)        \
    static void do_##function(const std::string &str)                         \
    {                                                                         \
        char foundIt = 0;                                                     \
                                                                              \
        if (str.empty())                                                      \
        {                                                                     \
            puts("You need to provide IP");                                   \
            return;                                                           \
        }                                                                     \
                                                                              \
        for (const auto &[key, val] : dicti)                                  \
        {                                                                     \
            if (key != str)                                                   \
            {                                                                 \
                continue;                                                     \
            }                                                                 \
                                                                              \
            foundIt = 1;                                                      \
                                                                              \
            if (val == 0U)                                                    \
            {                                                                 \
                std::cout << msg1 << str << '\n' << std::flush;               \
                std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay)); \
                if (launchCrypto == 0)                                        \
                {                                                             \
                    std::cout << msg2 << str << '\n' << std::flush;           \
                    dicti[key] = 1U;                                          \
                }                                                             \
                if (launchCrypto == 1)                                        \
                {                                                             \
                    if (checkFwSsh(key) == 1U)                                \
                    {                                                         \
                        return;                                               \
                    }                                                         \
                    std::cout << msg2 << str << '\n' << std::flush;           \
                    dicti[key] = 1U;                                          \
                    std::thread th(updateCrypto);                             \
                    th.detach();                                              \
                }                                                             \
            }                                                                 \
            else                                                              \
            {                                                                 \
                std::cout << msg3 << key << '\n' << std::flush;               \
            }                                                                 \
            break;                                                            \
        }                                                                     \
                                                                              \
        if (foundIt == 0)                                                     \
        {                                                                     \
            std::cout << "The given ip " << str << " does not exist\n" << std::flush;       \
        }                                                                     \
    }

CRACK_PROGRAM(crackssh, ipCracked, "Attempting to crack port 22 on ", "Cracked port 22 on ", "Port 22 already cracked for ", 0)
CRACK_PROGRAM(crypto, ipCrypto, "Attempting to deploy a crypto bot on ", "Crypto bot deployed on: ", "The crypto bot is already deployed for ", 1)
CRACK_PROGRAM(crackfw, ipFwCracked, "Attempting to crack the firewall on ", "Cracked the firewall on: ", "The firewall is already cracked for ", 0)

static unsigned short int checkFwSsh(const std::string &key)
{
    if (ipFwCracked[key] == 0U)
    {
        puts("Cannot connect to this IP as its firewall have to be cracked first with crackfw program");
        return 1U;
    }

    if (ipCracked[key] == 0U)
    {
        puts("Cannot connect to this IP as its ssh port have to be cracked first with crackssh program");
        return 1U;
    }
    return 0U;
}

static unsigned short int checkForkBomb(const std::string &str)
{
    for (const auto &[key, val] : ipForkBomb)
    {
        if (key != str)
        {
            continue;
        }

        if (val == 1U)
        {
            std::cout << "The pc " << key << " is down due to a fork bomb\n" << std::flush;
            return 1U;
        }
        break;
    }
    return 0U;
}

static void updateCrypto(void)
{
    std::this_thread::sleep_for(std::chrono::seconds(10));
    MONEY++;
    updateCrypto();
}

static void do_bank(const std::string &str)
{
    static_cast<void>(str);
    std::cout << "You have $ " << MONEY << '\n' << std::flush;
}

static void do_ls(const std::string &str)
{
    static_cast<void>(str);
    puts("notes.txt");
}

static void do_help(const std::string &str)
{
    static_cast<void>(str);
    static const char helpMsg[] = "ls: lists all directories and files in the current directory\n\n"
                                  "cat: reads the contents of the given file\n\n"
                                  "cat file.txt\n\n"
                                  "\n\n"
                                  "Networking:\n\n"
                                  "scan: shows computers linked to the current computer\n\n"
                                  "ssh: connects to the given IP\n\n"
                                  "ssh IP\n\n"
                                  "crackssh: Attempts to crack ip port 22\n\n"
                                  "crackssh IP\n\n"
                                  "crackfw Attempts to crack given ip firewall\n\n"
                                  "crackfw ip\n\n"
                                  "analyze Examine the key behind every ip firewall. Must use 'solve' command afterwards\n\n"
                                  "analyze ip\n\n"
                                  "solve will crack the ssh port as well the firewall\n\n"
                                  "solve key@ip\n\n"
                                  "\n\n"
                                  "Misc:\n\n"
                                  "crypto Installs a crypto miner bot for given ip\n\n"
                                  "crypto ip\n\n"
                                  "forkbomb Will cause a shell fork bomb and shutdown given ip\n\n"
                                  "forkbomb ip\n\n"
                                  "upgrade Will upgrade given PC part, must have enough money to purchase it, must install crypto bot first and wait till you have enough money to purchase it, once crypto bot is installed wait till you gain enough money and check them with the 'bank' program.\n\n"
                                  "upgrade: given PC part. Currently there's upgrade only for the 'cpu'.\n\n"
                                  "bank See your bank account after you deploy a crypto miner\n\n"
                                  "addip Add more IP's to the database, without the need to bypass firewalls and ssh protections, so you can deploy a crypto miner bot on these IP's and upgrade your CPU sooner, and make some money\n\n"
                                  "addip: 12.12.12.12\n\n"
                                  "addnote Will cause addition to 'notes.txt' file for the particular IP.\n\n"
                                  "addnote: 'Your text goes here'\n\n"
                                  "replace Will replace text within notes.txt\n\n"
                                  "replace old_text new_text\n\n"
                                  "delnotes Will delete the entire notes.txt for the connected IP address. Optionally you can specify IP argument and it will delete the notes.txt file for the given IP address.\n\n"
                                  "history Will show every command that you entered\n\n"
                                  "history: plain command without arguments\n\n"
                                  "uname Will show system kernel and cpu versions\n\n"
                                  "uname: plain command without arguemnts\n\n"
                                  "date Will show the current day/month/year and time in AM/PM\n\n"
                                  "date: plain command without arguments\n\n"
                                  "help: shows this helpful help page\n";
    puts(helpMsg);
}
```


To compile the program press **CTRL** + **SHIFT** + **B** , wait until it compiles, after that press **CTRL** + **\`** and paste this `cp -r C:\Users\YOUR_USERNAME_GOES_HERE\Desktop\main.exe C:\MingW\bin;cd C:\MingW\bin;.\main.exe`

If on Linux or *BSD

```bash
make -j8 # 8 cores/threads to use in parallel compile
sudo make install
```

Now to compile the `qt` version of `hackzy`. File `media/mainwindow.ui`:

```html
<?xml version="1.0" encoding="UTF-8"?>
<ui version="4.0">
 <class>MainWindow</class>
 <widget class="QMainWindow" name="MainWindow">
  <property name="geometry">
   <rect>
    <x>0</x>
    <y>0</y>
    <width>800</width>
    <height>600</height>
   </rect>
  </property>
  <property name="windowTitle">
   <string>hackzyGUI</string>
  </property>
  <property name="windowIcon">
   <iconset>
    <normaloff>media/icon.xpm</normaloff>media/icon.xpm</iconset>
  </property>
  <widget class="QWidget" name="centralwidget">
   <widget class="QLineEdit" name="lineEdit">
    <property name="geometry">
     <rect>
      <x>0</x>
      <y>0</y>
      <width>411</width>
      <height>41</height>
     </rect>
    </property>
    <property name="placeholderText">
     <string extracomment="Type here">frost@localhost 1.1.1.1 > Type here...</string>
    </property>
   </widget>
   <widget class="QPushButton" name="pushButton">
    <property name="geometry">
     <rect>
      <x>412</x>
      <y>0</y>
      <width>391</width>
      <height>41</height>
     </rect>
    </property>
    <property name="text">
     <string>Okay</string>
    </property>
    <property name="autoDefault">
     <bool>true</bool>
    </property>
    <property name="default">
     <bool>false</bool>
    </property>
   </widget>
   <widget class="QTextEdit" name="textEdit">
    <property name="geometry">
     <rect>
      <x>0</x>
      <y>40</y>
      <width>811</width>
      <height>571</height>
     </rect>
    </property>
    <property name="readOnly">
     <bool>true</bool>
    </property>
   </widget>
  </widget>
 </widget>
 <resources/>
 <connections/>
</ui>
```

File `CMakeLists.txt`:

```bash
#   11/19/2022
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

cmake_minimum_required(VERSION 3.5)

project(main VERSION 0.1 LANGUAGES CXX)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_THREAD_LIBS_INIT "-lpthread")
set(CMAKE_HAVE_THREADS_LIBRARY 1)
set(CMAKE_USE_WIN32_THREADS_INIT 0)
set(CMAKE_USE_PTHREADS_INIT 1)
set(THREADS_PREFER_PTHREAD_FLAG ON)

find_package(QT NAMES Qt6 Qt5 REQUIRED COMPONENTS Widgets)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Widgets)
find_package(Qt${QT_VERSION_MAJOR} REQUIRED COMPONENTS Multimedia)

set(PROJECT_SOURCES
        mainwindow.cpp
        mainwindow.h
        mainwindow.ui
)

if(${QT_VERSION_MAJOR} GREATER_EQUAL 6)
    qt_add_executable(main
        MANUAL_FINALIZATION
        ${PROJECT_SOURCES}
    )
else()
    if(ANDROID)
        add_library(main SHARED
            ${PROJECT_SOURCES}
        )
    else()
        add_executable(main
            ${PROJECT_SOURCES}
        )
    endif()
endif()

target_link_libraries(main PRIVATE Qt${QT_VERSION_MAJOR}::Widgets)
target_link_libraries(main PRIVATE Qt${QT_VERSION_MAJOR}::Multimedia)

set_target_properties(main PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER my.example.com
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

install(TARGETS main
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})

if(QT_VERSION_MAJOR EQUAL 6)
    qt_finalize_executable(main)
endif()
```

File `media/icon.xpm`:

```c
/* XPM */
static char *pdf2img_c_icon_xpm[] = {"24 24 124 2","     c None",".    c #484848","+     c #505050","@     c #818181","#     c #4E4E4E","$     c #484848","%     c #505050","&     c #3D3D3E","*     c #494949","=     c #808080","-     c #575757",";     c #383839",">     c #828282",",     c #4E4E4E","'     c #494949",")     c #464646","!     c #4A4A4A","~     c #4C4C4C","{     c #505050","]     c #4E4E4E","^     c #F9C940","/     c #4B4B4B","(     c #F8C73D","_     c #494949",":     c #4D4D4D","<     c #515151","[     c #525252","}     c #535353","|     c #818181","1     c #545454","2     c #FACA42","3     c #F8C73E","4     c #F8C83E","5     c #F7C63C","6     c #58554C","7     c #373838","8     c #4F4F4F","9     c #59564D","0     c #484848","a     c #383839","b     c #373738","c     c #3F3F3F","d     c #39393A","e     c #F6C335","f     c #FACB43","g     c #565656","h     c #F6C438","i     c #8E7D49","j     c #575757","k     c #8D7B47","l     c #C2A041","m     c #363637","n     c #F7C73C","o     c #383838","p     c #8D7B48","q     c #404141","r     c #FCCE48","s     c #FBCC45","t     c #474747","u     c #F6C333","v     c #C4A346","w     c #828282","x     c #907F4D","y     c #F2C749","z     c #FCCD47","A     c #FBCC44","B     c #363738","C     c #F9C93F","D     c #F9CA40","E     c #3A3B3B","F     c #F7C63B","G     c #EBB82A","H     c #8B763A","I     c #F7C53B","J     c #F6C232","K     c #6F664D","L     c #DBB547","M     c #F9CA41","N     c #F8C83F","O     c #F7C53A","P     c #F6C437","Q     c #D6AC36","R     c #6B6145","S     c #C3A243","T     c #C2A142","U     c #8D7A46","V     c #F6C43A","W     c #F6C439","X     c #565249","Y     c #F6C029","Z     c #827349","`     c #F8C93F"," .    c #806F41","..    c #B89A44","+.    c #E2B63D","@.    c #E1B53B","#.    c #F6C12E","$.    c #B59334","%.    c #555555","&.    c #464646","*.    c #B58F25","=.    c #FDD04A","-.    c #3E3F3F",";.    c #615A49",">.    c #5E5742",",.    c #746438","'.    c #414142",").    c #BDA24F","!.    c #F5BD1C","~.    c #EAB41A","{.    c #7F6C36","].    c #FED24C","^.    c #766A47","/.    c #7F6E3D","(.    c #EAB621","_.    c #817247",":.    c #ECBE3D","<.    c #817146","[.    c #EDC03E","}.    c #B79841","|.    c #56534A","1.    c #56524A","2.    c #B6953A","3.    c #F5C029","  j g %.1 } } [ < { +     # ] : ~ ~ >           ","j g %.%.1 } [ [ < { { + # ] ] : ~ ~ w @         ","g %.%.%.1 } [ [ < { { { ] ] ] : ~ ~ w | @       ","%.%.%.1 } } [ [ { { { 8 ] ] ] : ~ ~ w | | @     ","1 1 1 } } [ [ < { { { 9 9 ] ] : ~ ~ w | | | @   ","} } } } [ [ [ { { { { p k ] : ~ ~ ~ | | | | | = ","} [ [ [ [ [ { { { { 8 S T ] : ~ ~ ~ '.E d 7 b m ","[ [ [ [ < { { { { 8 9 ` n 6 ~ ~ ~ / / q d o b B ","< < < { { { { { 8 ] i D ( U ~ ~ ~ / / ! c a 7 7 ","{ { { { { { { 8 ] ] v ^ ( l ~ ~ / / / ! _ -.a a ","+ { { { { ).].=.r s f ^ 3 F W u Y !.*.! _ _ c ; ","  + { 8 ] ] x y z A 2 C ( I h J G H ! _ _ _ *   ","  # ] ] ] ] ] K L f M N ( O P Q R ! _ _ _ _ .   ","# ] ] ] ] ] ] ] 6 2 ^ 3 5 V e X ! ! _ _ _ _ 0 . ","] ] ] ] ] : : ~ Z ^ 4 ( I h J  .! _ _ _ _ 0 0 0 ",": : : : : ~ ~ ~ ..4 ( +.@.e #.$._ _ _ _ 0 0 0 0 ","~ ~ ~ ~ ~ ~ ~ ~ [.5 }.|.1.2.3.(._ _ _ _ 0 0 0 0 ","~ ~ ~ ~ ~ ~ ~ _.:.<./ / ! ! /.~.{._ _ 0 0 0 0 t ","~ ~ ~ ~ / / / ^.;./ ! ! _ _ _ >.,._ 0 0 0 0 t t ","/ / / / / / / / ! ! ! _ _ _ _ _ _ 0 0 0 0 t t t ","/ / / / / ! ! ! _ _ _ _ _ _ _ 0 0 0 0 0 t t t t ","! ! ! ! ! _ _ _ _ _ _ _ _ _ 0 0 0 0 0 t t t t t ","_ _ _ _ _ _ _ _ _ _ _ * . 0 0 0 0 0 t t t t t &.","  _ _ _ _ _ _ _ _ _ .     . 0 0 0 t t t t t &.  "};
```

File `media/Whitesnake.mp3`:

https://su8.github.io/img/file/hackzy/Whitesnake.mp3

File `mainwindow.cpp`:

```cpp
/*
  10/17/2022 https://github.com/su8/hackzy
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
#include <ctime>
#include <sys/types.h>
#include <unistd.h>
#include <cstdio>
#include <string>
#include <cstdlib>
#include <cstring>
#include <vector>
#include <unordered_map>
#include <chrono>
#include <thread>
#include <cctype>
#include <regex>

#include <QApplication>
#include <QCompleter>
#include <QStringList>
#include <QColor>
#include <QPalette>
#include <QAbstractItemView>
#include <QMediaPlayer>
#include <QAudioOutput>
#include <QRandomGenerator>
#include <QIcon>
//#include <QKeyEvent>
//#include <QObject>
#include "mainwindow.h"
#include "./ui_mainwindow.h"

static void do_ls(const std::string &str);
static void do_help(const std::string &str);
static void do_cat(const std::string &str);
static void do_scan(const std::string &str);
static void do_ssh(const std::string &str);
static void do_crackssh(const std::string &str);
static void do_crackfw(const std::string &str);
static void do_bank(const std::string &str);
static void do_crypto(const std::string &str);
static void do_analyze(const std::string &str);
static void do_solve(const std::string &str);
static void do_forkbomb(const std::string &str);
static void do_upgrade(const std::string &str);
static void do_addIp(const std::string &str);
static void do_addNote(const std::string &str);
static void do_replace(const std::string &str);
static void do_delNotes(const std::string &str);
static void do_history(const std::string &str);
static void do_uname(const std::string &str);
static void do_date(const std::string &str);
static inline void processInput(const std::string &str);
static inline void trimQuotes(char *bufPtr, const char *strPtr);
static void updateCrypto(void);
static unsigned short int checkForkBomb(const std::string &str);
static unsigned short int checkFwSsh(const std::string &key);

struct Opt
{
    const char *cmd;
    void (*my_func)(const std::string &str);
};

static const struct Opt opt[] = {
    {"ls", do_ls},
    {"help", do_help},
    {"cat", do_cat},
    {"scan", do_scan},
    {"ssh", do_ssh},
    {"crackfw", do_crackfw},
    {"crypto", do_crypto},
    {"bank", do_bank},
    {"analyze", do_analyze},
    {"solve", do_solve},
    {"forkbomb", do_forkbomb},
    {"crackssh", do_crackssh},
    {"addip", do_addIp},
    {"addnote", do_addNote},
    {"replace", do_replace},
    {"delnotes", do_delNotes},
    {"history", do_history},
    {"uname", do_uname},
    {"date", do_date},
    {"upgrade", do_upgrade}
};

static std::string IP = "1.1.1.1";
static unsigned long int MONEY = 0U;
static short int ConnectCrackDelay = 5;
static QString oldText = "";

static std::vector<std::string> ipArr = {
    "1.1.1.1",
    "44.55.66.77",
    "123.456.789.000",
    "noIP"
};

static std::unordered_map<std::string, unsigned short int> ipCracked   = { {ipArr[0], 1U} };
static std::unordered_map<std::string, unsigned short int> ipFwCracked = { {ipArr[0], 1U} };
static std::unordered_map<std::string, unsigned short int> ipCrypto    = { {ipArr[0], 0U} };
static std::unordered_map<std::string, unsigned short int> ipForkBomb  = { {ipArr[0], 0U} };
static std::unordered_map<std::string, std::string> ipSolved           = { {ipArr[0], ""} };
static std::unordered_map<std::string, std::string> NOTES              = { {ipArr[0], ""} };
static std::vector<std::string> History                                = {                };

static QStringList wordList = {
    "scan", "help", "forkbomb", "cat", "ssh", "crypto", "date",
    "crackssh", "crackfw", "analyze", "solve", "upgrade", "addip",
    "addnote", "delnotes", "bank", "ls", "replace", "history", "uname"
};
static QCompleter *completer = new QCompleter(wordList, nullptr);

//static std::vector<std::string> prevNextCmdArr;
//static QStringList prevNextCmd = {};
//static unsigned short int prevNextNum = 0U;

static QMediaPlayer *player = new QMediaPlayer();
static QAudioOutput *audioOutput = new QAudioOutput();

Ui::MainWindow *UI;

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    UI = ui;

    QPalette p = ui->textEdit->palette();
    p.setColor(QPalette::Base, Qt::black);
    p.setColor(QPalette::Text, Qt::green);
    ui->textEdit->setPalette(p);

    ui->textEdit->setText(static_cast<QString>("Type 'help' to see the available commands"));
    unsigned short int ipArrSize = static_cast<unsigned short int>(ipArr.size());
    for (unsigned short int x = 1U; x < ipArrSize; x++) {
        ipCracked.emplace(ipArr[x], 0U);
        ipFwCracked.emplace(ipArr[x], 0U);
        ipCrypto.emplace(ipArr[x], 0U);
        ipForkBomb.emplace(ipArr[x], 0U);
        ipSolved.emplace(ipArr[x], "");
        NOTES.emplace(ipArr[x], "");
    }
    ui->lineEdit->setCompleter(completer);
    completer->popup()->setStyleSheet("background-color:rgb(54, 57, 63); color:white;");

    ui->lineEdit->setClearButtonEnabled(true);
    ui->lineEdit->addAction(static_cast<QIcon>("media/linux.png"), QLineEdit::LeadingPosition);

    player->setAudioOutput(audioOutput);
    player->setSource(QUrl::fromLocalFile("media/Whitesnake.mp3"));
    audioOutput->setVolume(100);
    player->play();

    connect(player, &QMediaPlayer::mediaStatusChanged, player, &QMediaPlayer::play);
    connect(ui->lineEdit, &QLineEdit::returnPressed, this, &MainWindow::on_pushButton_clicked);
    //qApp->installEventFilter(this);
}

MainWindow::~MainWindow()
{
    delete completer;
    player->stop();
    delete audioOutput;
    delete player;
    //delete UI;
    delete ui;
}

void MainWindow::on_pushButton_clicked()
{
    std::string userInput = static_cast<std::string>(ui->lineEdit->text().toStdString());

    if (userInput.empty())
    {
        return;
    }

    QString inputStr = ui->lineEdit->text();
    ui->textEdit->setText(inputStr + static_cast<QString>('\n') + oldText);
    ui->lineEdit->setText(static_cast<QString>(""));

    //prevNextNum++;
    //prevNextCmdArr.emplace_back(userInput);
    //prevNextCmd.append(inputStr);

    History.emplace_back(userInput);
    processInput(userInput);
}

/*bool MainWindow::eventFilter(QObject *object, QEvent *e)
{
    QKeyEvent *keyEvent = static_cast<QKeyEvent *>(e);
    if (keyEvent->key() == Qt::Key_Up)
    {
        if (prevNextNum > 0U)
        {
            prevNextNum--;
        }
        ui->lineEdit->setText(prevNextCmd[prevNextNum]);
        return true;
    }
    else if (keyEvent->key() == Qt::Key_Down)
    {
        if (prevNextNum < (prevNextCmdArr.size() - 1))
        {
            prevNextNum++;
        }
        ui->lineEdit->setText(prevNextCmd[prevNextNum]);
        return true;
    }
    return false;
}*/

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();
    return a.exec();
}

static inline void processInput(const std::string &str)
{
    unsigned short int x = 0U;
    char buf[128] = {'\0'};
    char cmd[10] = {'\0'};
    char matchCmd = 0;
    const char *strPtr = str.c_str();
    char *cmdPtr = cmd;

    for (x = 0U; x < 9U && *strPtr; x++, strPtr++)
    {
        if (*strPtr == ' ')
        {
            strPtr++;
            break;
        }
        *cmdPtr++ = *strPtr;
    }
    *cmdPtr = '\0';

    for (x = 0U; x < sizeof(opt) / sizeof(opt[0]); x++)
    {
        if (!(strcmp(opt[x].cmd, cmd)))
        {
            matchCmd = 1;
            break;
        }
    }

    if (matchCmd == 0)
    {
        QString outStr = static_cast<std::string>("Couldn't find the entered " + str + " command.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    trimQuotes(buf, strPtr);
    opt[x].my_func(static_cast<std::string>(buf));
    UI->lineEdit->setPlaceholderText(static_cast<QString>(static_cast<std::string>("frost@localhost " + IP + " > Type here...").c_str()));
}

static inline void trimQuotes(char *bufPtr, const char *strPtr)
{
    for (unsigned short int x = 0U; x < 127U && *strPtr; x++, strPtr++)
    {
        if (*strPtr == '"' || *strPtr == '\'')
        {
            continue;
        }

        *bufPtr++ = *strPtr;
    }
    *bufPtr = '\0';
}

static void do_cat(const std::string &str)
{
    if (str != "notes.txt")
    {
        QString outStr = static_cast<std::string>("No such " + str + " file\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    for (const auto &[key, val] : NOTES)
    {
        if (key == IP)
        {
            QString outStr = static_cast<std::string>(val + '\n').c_str();
            UI->textEdit->setText(outStr);
            break;
        }
    }
}

static void do_scan(const std::string &str)
{
    static_cast<void>(str);
    oldText = "";
    for (const auto &key : ipArr)
    {
        QString outStr = static_cast<std::string>(key + '\n').c_str();
        UI->textEdit->setText(oldText + outStr);
        oldText += outStr;
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        qApp->processEvents();
    }
    oldText = "";
}

static void do_ssh(const std::string &str)
{
    char foundIt = 0;

    if (str.empty())
    {
        QString outStr = static_cast<std::string>("You need to provide IP.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    if (checkForkBomb(str) == 1U)
    {
        return;
    }

    for (const auto &[key, val] : ipFwCracked)
    {
        if (key != str)
        {
            continue;
        }

        if (checkFwSsh(key) == 1U)
        {
            return;
        }

        foundIt = 1;
        QString outStr = static_cast<std::string>("Connected to: " + str + '\n').c_str();
        UI->textEdit->setText(outStr);
        IP = str;
        break;
    }

    if (foundIt == 0)
    {
        QString outStr = static_cast<std::string>("The given IP " + str + " does not exist\n").c_str();
        UI->textEdit->setText(outStr);
    }
}

static void do_analyze(const std::string &str)
{
    unsigned short int x = 50U;
    unsigned short int z = 50U;
    unsigned short int w = 0U;
    char foundIt = 0;
    char buf[30] = {'\0'};
    char *bufPtr = buf;
    static const char alphas[] = "abcdefghijklmnopqrstuvwxyz";
    std::string keyStr = "";

    if (str.empty())
    {
        QString outStr = static_cast<std::string>("You need to provide IP.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    UI->textEdit->setText(static_cast<QString>("Please wait..."));
    qApp->processEvents();
    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    if (checkForkBomb(str) == 1U)
    {
        return;
    }

    for (const auto &[key, val] : ipFwCracked)
    {
        if (key != str)
        {
            continue;
        }

        foundIt = 1;
        keyStr = key;
        break;
    }

    if (foundIt == 0)
    {
        QString outStr = static_cast<std::string>("The given IP " + str + " does not exist.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    oldText = "";
    for (x = 50U; x < 256U; x++, z++)
    {
        if (z & 1U)
        {
            *bufPtr = alphas[static_cast<unsigned short int>(QRandomGenerator::global()->bounded(0, 26))];
            UI->textEdit->setText(oldText + static_cast<QString>(*bufPtr));
            oldText += static_cast<QString>(*bufPtr++);
            if (w++ > 28U)
            {
                break;
            }
        }
        else
        {
            static const QString outStr = "0";
            UI->textEdit->setText(oldText + outStr);
            oldText += outStr;
            qApp->processEvents();
            std::this_thread::sleep_for(std::chrono::milliseconds(10));
        }

        z >>= static_cast<unsigned short int>(1U);
    }
    UI->textEdit->setText(oldText + static_cast<QString>("\nDone."));
    *bufPtr = '\0';
    ipSolved[keyStr] = static_cast<std::string>(buf);
}

static void do_solve(const std::string &str)
{
    unsigned short int x = 0U;
    char foundIt = 0;
    char buf[10] = {'\0'};
    char *bufPtr = buf;
    const char *strPtr = str.c_str();

    if (str.empty())
    {
        QString outStr = static_cast<std::string>("You need to provide key@IP.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    UI->textEdit->setText(static_cast<QString>("Please wait..."));
    qApp->processEvents();
    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    for (; *strPtr && x < 9U; strPtr++, x++)
    {
        if (*strPtr == '@')
        {
            strPtr++;
            break;
        }
        *bufPtr++ = *strPtr;
    }
    *bufPtr = '\0';

    std::string bufStr = static_cast<std::string>(buf);
    for (const auto &[key, val] : ipSolved)
    {
        if (val != bufStr)
        {
            continue;
        }

        ipFwCracked[key] = 1U;
        ipCracked[key] = 1U;
        foundIt = 1;
        break;
    }

    if (foundIt == 0)
    {
        QString outStr = static_cast<std::string>("The given key@ip " + str + "does not exist.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    QString outStr = static_cast<std::string>("Successfully solved the key for " + str + '\n').c_str();
    UI->textEdit->setText(outStr);
}

static void do_forkbomb(const std::string &str)
{
    char foundIt = 0;

    if (str.empty())
    {
        QString outStr = static_cast<std::string>("You need to provide IP.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    if (str == "noIP")
    {
        QString outStr = static_cast<std::string>("You can't execute a fork bomb for 'noIP'.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    UI->textEdit->setText(static_cast<QString>("Please wait...."));
    qApp->processEvents();
    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    for (const auto &[key, val] : ipForkBomb)
    {
        if (key != str)
        {
            continue;
        }

        if (checkFwSsh(key) == 1U)
        {
            return;
        }

        if (val == 1U)
        {
            QString outStr = static_cast<std::string>("The pc " + key + " is down due to fork bomb\n").c_str();
            UI->textEdit->setText(outStr);
            return;
        }

        if (key == IP)
        {
            IP = "noIP";
        }
        foundIt = 1;
        ipForkBomb[key] = 1U;
        break;
    }

    if (foundIt == 0)
    {
        QString outStr = static_cast<std::string>("The given ip " + str + " does not exist\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    QString outStr = static_cast<std::string>("Successfully executed a fork bomb for " + str + '\n').c_str();
    UI->textEdit->setText(outStr);
}

static void do_upgrade(const std::string &str) {
    if (str.empty())
    {
        QString outStr = static_cast<std::string>("You need to provide what PC part you want to upgrade. Currently we have available upgrades only for the 'cpu'.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    if (strlen(str.c_str()) == 3 && (tolower(str[0]) == 'c' && tolower(str[1]) == 'p' && tolower(str[2]) == 'u'))
    {
        if (ConnectCrackDelay == 5 && MONEY >= 10U)
        {
            ConnectCrackDelay = 1;
            MONEY -= 10U;
            QString outStr = static_cast<std::string>("Successfully purchased a CPU upgrade.\n").c_str();
            UI->textEdit->setText(outStr);
            return;
        }
        else if (ConnectCrackDelay == 1)
        {
            QString outStr = static_cast<std::string>("You already upgraded the CPU.\n").c_str();
            UI->textEdit->setText(outStr);
        }
        else if (MONEY < 10U)
        {
            QString outStr = static_cast<std::string>("You don't have $10 which are needed to upgrade your CPU.\n").c_str();
            UI->textEdit->setText(outStr);
        }
    }
    else
    {
        QString outStr = static_cast<std::string>("We don't have any upgrades for this pc part " + str + '\n').c_str();
        UI->textEdit->setText(outStr);
    }
}

static void do_addIp(const std::string &str)
{
    unsigned short int z = static_cast<unsigned short int>(str.length());
    char toAddIp = 1;
    const char *strPtr = str.c_str();

    UI->textEdit->setText(static_cast<QString>("Please wait..."));
    qApp->processEvents();
    std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay));

    for (unsigned short int x = 0U; x < z; x++, strPtr++)
    {
        unsigned char cStrPtr = static_cast<unsigned char>(*strPtr);
        if ((!(isdigit(cStrPtr)) && *strPtr == '.') || isdigit(cStrPtr))
        {
            continue;
        }
        else
        {
            toAddIp = 0;
            break;
        }
    }

    if (toAddIp == 0)
    {
        QString outStr = static_cast<std::string>("The given IP address " + str + " can't be added because it contains letters or it's empty.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    if (ipCrypto.count(str))
    {
        QString outStr = static_cast<std::string>("The given IP address " + str + "already exist, no further actions will be taken.\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }

    ipArr.emplace_back(str);
    ipFwCracked.emplace(str, 0U);
    ipCracked.emplace(str, 0U);
    ipCrypto.emplace(str, 0U);
    NOTES.emplace(str, "");
    ipForkBomb.emplace(str, 0U);

    QString outStr = static_cast<std::string>("Successfully added " + str + " to the IP database, now you can deploy a crypto miner bot to this IP.\n").c_str();
    UI->textEdit->setText(outStr);
}

static void do_addNote(const std::string &str)
{
    for (const auto &[key, val] : NOTES)
    {
        if (key == IP)
        {
            NOTES[key] += str + '\n';
            QString outStr = static_cast<std::string>("Done.\n").c_str();
            UI->textEdit->setText(outStr);
            break;
        }
    }
}

static void do_replace(const std::string &str)
{
    unsigned short int strLen = static_cast<unsigned short int>(str.length());
    char foundIt = 0;
    char gotFirstStr = 0;
    char buf1[128] = {'\0'};
    char buf2[128] = {'\0'};
    char *bufPtr1 = buf1;
    char *bufPtr2 = buf2;
    const char *strPtr = str.c_str();

    for (unsigned short int x = 0U; x < strLen && x < 127U; x++)
    {
        if (gotFirstStr == 0)
        {
            if (*strPtr == ' ')
            {
                gotFirstStr = 1;
                strPtr++;
                continue;
            }
            *bufPtr1++ = *strPtr++;
        }
        else
        {
            *bufPtr2++ = *strPtr++;
        }
    }
    *bufPtr1 = '\0';
    *bufPtr2 = '\0';

    for (const auto &[key, val] : NOTES)
    {
        if (key == IP)
        {
            if (NOTES[key].find(buf1) != std::string::npos)
            {
                NOTES[key] = std::regex_replace(NOTES[key], std::regex(buf1), buf2);
                foundIt = 1;
                QString outStr = static_cast<std::string>("Done.\n").c_str();
                UI->textEdit->setText(outStr);
                break;
            }
        }
    }

    if (foundIt == 0)
    {
        QString outStr = static_cast<std::string>("We couldn't find a text within your notes.txt to replace " + str + "\n").c_str();
        UI->textEdit->setText(outStr);
    }
}

static void do_delNotes(const std::string &str)
{
    if (str.empty())
    {
        NOTES[IP] = "";
    }
    else if (!(NOTES.count(str)))
    {
        QString outStr = static_cast<std::string>("No such IP address " + str + "\n").c_str();
        UI->textEdit->setText(outStr);
        return;
    }
    else
    {
        NOTES[str] = "";
    }
    QString outStr = static_cast<std::string>("Done.\n").c_str();
    UI->textEdit->setText(outStr);
}

static void do_history(const std::string &str)
{
    oldText = "";
    static_cast<void>(str);
    for (const auto &key : History)
    {
        QString outStr = (key + '\n').c_str();
        UI->textEdit->setText(oldText + outStr);
        oldText += outStr;
    }
    oldText = "";
}

static void do_uname(const std::string &str)
{
    static_cast<void>(str);
    static const QString uname = "Linux localhost 5.10.52-gentoo SMP Sun October 30 6:56 PM CEST x86_64 Intel i9-13900K GNU/Linux\n";
    UI->textEdit->setText(uname);
}

static void do_date(const std::string &str)
{
    static_cast<void>(str);
    char time_str[128];
    time_t t = 0;
    struct tm *taim = NULL;

    if ((t = time(NULL)) == -1 || (taim = localtime(&t)) == NULL ||
      (strftime(time_str, 128, "%d %m %Y %I:%M %p", taim)) == 0) {
        UI->textEdit->setText(static_cast<QString>("Time failed!\n"));
        return;
    }

    UI->textEdit->setText(static_cast<QString>(time_str));
}

#define CRACK_PROGRAM(function, dicti, msg1, msg2, msg3, launchCrypto)        \
    static void do_##function(const std::string &str)                         \
    {                                                                         \
        char foundIt = 0;                                                     \
                                                                              \
        if (str.empty())                                                      \
        {                                                                     \
            QString outStr = static_cast<std::string>("You need to provide IP.\n").c_str(); \
            UI->textEdit->setText(outStr);                                    \
            return;                                                           \
        }                                                                     \
                                                                              \
        for (const auto &[key, val] : dicti)                                  \
        {                                                                     \
            if (key != str)                                                   \
            {                                                                 \
                continue;                                                     \
            }                                                                 \
                                                                              \
            foundIt = 1;                                                      \
                                                                              \
            if (val == 0U)                                                    \
            {                                                                 \
                QString outStr = static_cast<std::string>(msg1 + str + '\n').c_str(); \
                UI->textEdit->setText(outStr);                                \
                qApp->processEvents();                                        \
                std::this_thread::sleep_for(std::chrono::seconds(ConnectCrackDelay)); \
                if (launchCrypto == 0)                                        \
                {                                                             \
                    QString outStr = static_cast<std::string>(msg2 + str + '\n').c_str(); \
                    UI->textEdit->setText(outStr);                            \
                    dicti[key] = 1U;                                          \
                }                                                             \
                if (launchCrypto == 1)                                        \
                {                                                             \
                    if (checkFwSsh(key) == 1U)                                \
                    {                                                         \
                        return;                                               \
                    }                                                         \
                    QString outStr = static_cast<std::string>(msg2 + str + '\n').c_str(); \
                    UI->textEdit->setText(outStr);                            \
                    dicti[key] = 1U;                                          \
                    std::thread th(updateCrypto);                             \
                    th.detach();                                              \
                }                                                             \
            }                                                                 \
            else                                                              \
            {                                                                 \
                QString outStr = static_cast<std::string>(msg3 + str + '\n').c_str(); \
                UI->textEdit->setText(outStr);                                \
            }                                                                 \
            break;                                                            \
        }                                                                     \
                                                                              \
        if (foundIt == 0)                                                     \
        {                                                                     \
            QString outStr = static_cast<std::string>("The given IP " + str + " does not exist").c_str(); \
            UI->textEdit->setText(outStr + static_cast<QString>('\n'));       \
        }                                                                     \
    }

CRACK_PROGRAM(crackssh, ipCracked, "Attempting to crack port 22 on ", "Cracked port 22 on ", "Port 22 already cracked for ", 0)
CRACK_PROGRAM(crypto, ipCrypto, "Attempting to deploy a crypto bot on ", "Crypto bot deployed on: ", "The crypto bot is already deployed for ", 1)
CRACK_PROGRAM(crackfw, ipFwCracked, "Attempting to crack the firewall on ", "Cracked the firewall on: ", "The firewall is already cracked for ", 0)

static unsigned short int checkFwSsh(const std::string &key)
{
    if (ipFwCracked[key] == 0U)
    {
        QString outStr = static_cast<std::string>("Cannot connect to this IP as it's firewall have to be cracked first with the crackfw program.").c_str();
        UI->textEdit->setText(outStr);
        return 1U;
    }

    if (ipCracked[key] == 0U)
    {
        QString outStr = static_cast<std::string>("Cannot connect to this IP as it's ssh port have to be cracked first with the crackssh program.\n").c_str();
        UI->textEdit->setText(outStr);
        return 1U;
    }
    return 0U;
}

static unsigned short int checkForkBomb(const std::string &str)
{
    for (const auto &[key, val] : ipForkBomb)
    {
        if (key != str)
        {
            continue;
        }

        if (val == 1U)
        {
            QString outStr = static_cast<std::string>("The pc " + key + " is down due to a fork bomb\n").c_str();
            UI->textEdit->setText(outStr);
            return 1U;
        }
        break;
    }
    return 0U;
}

static void updateCrypto(void)
{
    std::this_thread::sleep_for(std::chrono::seconds(10));
    MONEY++;
    updateCrypto();
}

static void do_bank(const std::string &str)
{
    static_cast<void>(str);
    std::string cash = std::to_string(MONEY);
    QString outStr = static_cast<std::string>("You have $" + cash + '\n').c_str();
    UI->textEdit->setText(outStr);
}

static void do_ls(const std::string &str)
{
    static_cast<void>(str);
    QString outStr = static_cast<std::string>("notes.txt\n").c_str();
    UI->textEdit->setText(outStr);
}

static void do_help(const std::string &str)
{
    static_cast<void>(str);
    static const QString helpMsg = "<p style=\"color:#F9DB24\">ls: lists all directories and files in the current directory</p>\n"
                                  "<p style=\"color:#F9DB24\">cat: reads the contents of the given file</p>\n"
                                  "<p style=\"color:#F9DB24\">cat file.txt</p>\n"
                                  "\n"
                                  "\nNetworking:\n"
                                  "<p style=\"color:#F9DB24\">scan: shows computers linked to the current computer</p>\n"
                                  "<p style=\"color:#F9DB24\">ssh: connects to the given IP</p>\n"
                                  "<p style=\"color:#F9DB24\">ssh IP</p>\n"
                                  "<p style=\"color:#F9DB24\">crackssh: Attempts to crack ip port 22</p>\n"
                                  "<p style=\"color:#F9DB24\">crackssh IP</p>\n"
                                  "<p style=\"color:#F9DB24\">crackfw Attempts to crack given ip firewall</p>\n"
                                  "<p style=\"color:#F9DB24\">crackfw ip</p>\n"
                                  "\n"
                                  "\nMisc:\n"
                                  "<p style=\"color:#F9DB24\">crypto Installs a crypto miner bot for given ip</p>\n"
                                  "<p style=\"color:#F9DB24\">crypto ip</p>\n"
                                  "<p style=\"color:#F9DB24\">forkbomb Will cause a shell fork bomb and shutdown given ip</p>\n"
                                  "<p style=\"color:#F9DB24\">forkbomb ip</p>\n"
                                  "<p style=\"color:#F9DB24\">upgrade Will upgrade given PC part, must have enough money to purchase it, must install crypto bot first and wait till you have enough money to purchase it, once crypto bot is installed wait till you gain enough money and check them with the 'bank' program.</p>\n"
                                  "<p style=\"color:#F9DB24\">upgrade: given PC part. Currently there's upgrade only for the 'cpu'.</p>\n"
                                  "<p style=\"color:#F9DB24\">bank See your bank account after you deploy a crypto miner</p>\n"
                                  "<p style=\"color:#F9DB24\">addip Add more IP's to the database, without the need to bypass firewalls and ssh protections, so you can deploy a crypto miner bot on these IP's and upgrade your CPU sooner, and make some money</p>\n"
                                  "<p style=\"color:#F9DB24\">addip: 12.12.12.12</p>\n"
                                  "<p style=\"color:#F9DB24\">addnote Will cause addition to 'notes.txt' file for the particular IP.</p>\n"
                                  "<p style=\"color:#F9DB24\">addnote: 'Your text goes here'</p>\n"
                                  "<p style=\"color:#F9DB24\">replace Will replace text within notes.txt</p>\n"
                                  "<p style=\"color:#F9DB24\">replace: old_text new_text</p>\n"
                                  "<p style=\"color:#F9DB24\">delnotes Will delete the entire notes.txt for the connected IP address. Optionally you can specify IP argument and it will delete the notes.txt file for the given IP address.</p>\n"
                                  "<p style=\"color:#F9DB24\">history Will show every command that you entered</p>\n"
                                  "<p style=\"color:#F9DB24\">history: plain command without arguments</p>\n"
                                  "<p style=\"color:#F9DB24\">uname Will show system kernel and cpu versions</p>\n"
                                  "<p style=\"color:#F9DB24\">uname: plain command without arguemnt</p>\n"
                                  "<p style=\"color:#F9DB24\">date Will show the current day/month/year and time in AM/PM</p>\n"
                                  "<p style=\"color:#F9DB24\">date: plain command without arguments</p>\n"
                                  "<p style=\"color:#F9DB24\">help: shows this helpful help page</p>\n"
                                  "<p style\"solid-color:green\"></p>";
    UI->textEdit->setText(helpMsg);
}
```

File `mainwindow.h`:

```cpp
/*
  10/17/2022 https://github.com/su8/hackzy
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
#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_pushButton_clicked();
    //bool eventFilter(QObject *object, QEvent *e);

private:
    Ui::MainWindow *ui;
};
#endif // MAINWINDOW_H
```

---

# Compile with:

```bash
cmake .
make -j8 # 8 cores/threads to use in parallel compile
sudo make install
```

---

# Windows Additional codecs

You need to install the multimedia codec, so the game to play Whitesnake song. If you already installed Qt 6, go to C:\Qt and launch the **maintenance.exe** program. Click on these options:

![](img/file/hackzy/multimedia1.png)
![](img/file/hackzy/multimedia2.png)

---

Open up the Qt Creator and import this project folder if you want to edit/compile **hackzy** from the Qt Creator itself. To compile and run the program from Qt Creator, press **CTRL** + **r**, but you must copy and paste **media/icon.xpm, media/Whitesnake.mp3, media/linux.png** to the folder **build-NUMBERS/media** and then press **CTRL** + **r** to build and run the program/game.

If on windows, you'll have to download the online [Qt installer](https://www.qt.io/cs/c/?cta_guid=074ddad0-fdef-4e53-8aa8-5e8a876d6ab4&signature=AAH58kEJJxpduKtfibJ40aRNSB4V5QaI1A&pageId=12602948080&placement_guid=99d9dd4f-5681-48d2-b096-470725510d34&click=559deaff-10e4-44a7-a78c-ef8b98f3c31a&hsutk=&canon=https%3A%2F%2Fwww.qt.io%2Fdownload-open-source&portal_id=149513&redirect_url=APefjpGq5H2gLEy0rkYfu04Stc7zjmm0KqS_XaAVoOUeI1pUOzGQZgD_zg87kf-KWNMA8LagnlFie8sOAzzTMW8z48C4QlIP08Ykoqpk2QaLznoki0aaOBah-YfMzg2wugOl_TcZQF2S) and install Qt 6 **manually** from the GUI installer. Don't go with the defaults, choose **manual** installation and scroll up to see the **multimedia** codec which you must select in order to compile hackzy GUI.

---

The game was entirely written from my tablet with **CxxDroid** up until the 59th commit, afterwards the game is written from my brand new windows laptop.