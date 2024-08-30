
---


Notice the first grey CPU 0% 0% 0% line

![](img/file/yepstat/yepstat.png)

yepstat is acting like status line that overwrites your very first terminal line every 0.5 seconds, so you can easily keep track of things that you are interested to monitor while hacking something in the terminal. It's meant to be efficient and fast even when under 100% cpu and drive I/O load.

This is exactly what we do: save the current position of the cursor, move it to the top left corner of the terminal, clear the entire line, output the desired data and restore the cursor position, so you get the feeling that there is a real status line up there.

Here is the `tput` equivalent of yepstat:

```bash
while true; do tput sc;tput cup 0 0; tput el;printf '%s' 'Hello World';tput rc;sleep 0.5;done &
```

We could also use the -S option:

```bash
while true; do tput -S <<EOF
sc
cup 0 0
el
EOF
;printf '%s' 'Hello World';tput rc;sleep 0.5;done &
```

To be able to use PageUp and PageDown in your terminal, you'll have to disable auto scrolling on tty output.

Once you understand the concept, you'll find [6] interesting, after which you'll get why the program needs to be as fast as possible.

Spoiler, single iteration comparison:

```bash
# yepstat
real    0m0.001s
user    0m0.000s
sys     0m0.000s

# tput
real    0m0.006s
user    0m0.002s
sys     0m0.002s

# the shell alone
# echo -en "\0337\033[1;1H\033[K" YOUR DATA "\0338"
real    0m0.003s
user    0m0.001s
sys     0m0.002s
```

Obviously the "speed" has it's price and it's the compatibility that tput provides.

---

# Installation

```bash
make
sudo make install
```

---

# Usage

Changing colours, font type, boldness and so on happens by using ANSI escape codes [1] , [2] , [3] and [4]

I do advice you to use the `print2` program that comes with yepstat.

```bash
# The updating process
while true; do echo '\e[101;96mlight cyan fg on light red bg\e[0m'; done | ./yepstat &

# instead using "print,printf,echo",
# but you'll have to replace "033,x1B" occurences with "\e"
while true; do print2 '\e[101;96mlight cyan fg on light red bg\e[0m'; done | ./yepstat &
```

You can have it auto start in your .bashrc or .zshrc
Just dont forget & at end.
---

# Requirements

* gcc/clang
* glibc/libc
* terminal emulator supporting ANSI escape codes [5]

[1]: https://en.wikipedia.org/wiki/ANSI_escape_code
[2]: http://www.growingwiththeweb.com/2015/05/colours-in-gnome-terminal.html
[3]: http://www.tldp.org/HOWTO/Bash-Prompt-HOWTO/c327.html
[4]: https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux/23006365
[5]: https://en.wikipedia.org/wiki/List_of_terminal_emulators
[6]: https://unix.stackexchange.com/questions/116629/how-do-keyboard-input-and-text-output-work

File `Makefile`

```bash
#   07/29/2018
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

CFLAGS+=-Wall -Wextra -O2 -D_POSIX_C_SOURCE=200112L -std=c99 -pipe -pedantic -Wundef -Wshadow -W -Wwrite-strings -Wcast-align -Wstrict-overflow=5 -Wconversion -Wpointer-arith -Wstrict-prototypes -Wformat=2 -Wsign-compare -Wendif-labels -Wredundant-decls -Winit-self
SRCS=yepstat.c print2.c
PROGS=yepstat print2
BIN_DIR=/usr/bin

all: $(PROGS)

%: %.c
	$(CC) $(CFLAGS) -o $@ $<

install: 
	install -D -s -m 755 yepstat $(BIN_DIR)/yepstat
	install -D -s -m 755 print2 $(BIN_DIR)/print2

uninstall:
	rm -f $(BIN_DIR)/yepstat
	rm -f $(BIN_DIR)/print2

clean:
	rm -f yepstat
	rm -f print2

.PHONY: all install clean uninstall
```

File `print2.c`

```c
/*
  05/30/2017

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
#include <string.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  char *str = NULL, buf[1000];
  char *ptr = buf;
  int x = 1, z = 0;

  if (1 == argc) {
    return EXIT_FAILURE;
  }

  for (; x < argc; x++, z++) {
    for (str = argv[x]; *str; str++, z++) {
      if (998 < z) {
        goto out;
      }
      if ('\\' == *str && ('e' == *(str+1))) { // the '\e' sequence
        *ptr++ = '\x1B';
        str++;
        continue;
      }
      *ptr++ = *str;
    }
    *ptr++ = ' ';
  }

out:
  *(--ptr) = '\0';

  if (!puts(buf)) {
    return EXIT_FAILURE;
  }

  return EXIT_SUCCESS;
}
```

File `yepstat.c`

```c
/*
  11/16/2016

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
#include <time.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define STRZIZE(x) ((sizeof(x) / sizeof(char)))

static inline void update_line(const char *);
static inline void check_n_update(void);

int main(void) {
  struct timespec tc = { 0L, 500L * 1000000L };

  while (1) {
    check_n_update();
    if (-1 == (nanosleep(&tc, NULL))) {
      exit(EXIT_FAILURE);
    }
  }
  return EXIT_SUCCESS;
}

static inline void 
check_n_update(void) {
  static char buf[1000] = "Hello World";

  if (NULL != fgets(buf, 999, stdin)) {
    update_line(buf);
  }
}

static inline void 
update_line(const char *buf) {
  static char x = 0, newbuf[1030] = "Hello World";
  static const char cursor[] = "\0337\033[1;1H\033[K";
  static const char second_end[] = "\0338";
  static char *const first_end = newbuf + STRZIZE(cursor)-1;
  size_t buflen = strlen(buf);

  if (0 == x) {
    memcpy(newbuf, cursor, STRZIZE(cursor)-1);
    x = 1;
  }
  memcpy(first_end, buf, buflen);
  memcpy(first_end + buflen, second_end, STRZIZE(second_end));

  fputs(newbuf, stdout);
  if (0 != (fflush(stdout))) {
    exit(EXIT_FAILURE);
  }
}
```