/*
    uname2.c -- my 'uname' implementation
    Compile with: gcc -Wall -O2 -o uname2 uname2.c
 
   Copyright 01/17/2015 Aaron Caffrey https://github.com/wifiextender
 
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
#include <sys/utsname.h>
#include <argp.h>

static char doc[] =
    "Print certain system information.  With no OPTION, same as -s.\v"
    "GNU coreutils online help: <http://www.gnu.org/software/coreutils/>\n"
    "For complete documentation, run: info coreutils 'uname invocation'";

static struct argp_option options[] =
{
    { .doc = "" },
    { .name = "all",            .key = 'a', .doc = "print all information"    },
    { .name = "nodename", .key = 'n', .doc = "print the network node hostname"},
    { .name = "kernel-name",    .key = 's', .doc = "print the kernel name"    },
    { .name = "kernel-version", .key = 'v', .doc = "print the kernel version" },
    { .name = "kernel-release", .key = 'r', .doc = "print the kernel release" },
    { .name = "machine", .key = 'm', .doc = "print the machine hardware name" },
    { .doc = NULL }
};

static struct utsname info;

static error_t parse_opt(int key, char *arg, struct argp_state *state)
{
    switch(key)
    {
        case 'a': printf("%s %s %s %s %s",
                    info.sysname, info.nodename,
                    info.release, info.version,
                    info.machine);
                  return ARGP_KEY_SUCCESS;
        case 's': printf("%s ", info.sysname);
                  break;
        case 'n': printf("%s ", info.nodename);
                  break;
        case 'r': printf("%s ", info.release);
                  break;
        case 'v': printf("%s ", info.version);
                  break;
        case 'm': printf("%s ", info.machine);
                  break;
        default: return ARGP_ERR_UNKNOWN;
    }
    return EXIT_SUCCESS;
}

int main(int argc, char **argv)
{

    uname(&info);
    static struct argp arg_parser = { .doc = doc,
                                      .options = options, 
                                      .parser = parse_opt };
    argp_parse(&arg_parser, argc, argv, 0, NULL, NULL);

    if (1 == argc)
        printf("%s", info.sysname);

    putchar('\n');

    return EXIT_SUCCESS;
}