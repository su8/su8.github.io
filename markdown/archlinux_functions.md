
---

Here are some of the acrhlinux functions that I used back when I was using archlinux. They are meant to be used with the `zsh` shell, if you want to stick with `bash` you can easily convert them to the `bash` shell too.

File `archlinux.zsh` which can be `source` 'd from your `.zshrc` configuration file:

```bash
#---------------------------------------------
# Archlinux functions
#---------------------------------------------

######## Pacman ########
# Update
Syu() { sudo pacman -Syu ;}

# Search
Ss() { pacman -Ss $@ ;}

# Install
S() { sudo pacman -S $@ ;}

# Remove
R() { sudo pacman -R $@ ;}

# Remove including deps
Rsnc() {
    sudo pacman -Rsnc $@

    for x in $@
    do

        # VLC metadata >> /dev/null
        [[ $x == 'vlc' ]] && {
            sed -i 's/list=.*//g;s/times=.*//g' \
                "${XDG_CONFIG_HOME}/vlc/vlc-qt-interface.conf"
            rm -rf {${XDG_DATA_HOME},${XDG_CACHE_HOME}}/vlc
        }

        # qbittorrent metadata >> /dev/null
        [[ $x == 'qbittorrent' ]] && \
            rm -rf ${XDG_CONFIG_HOME}/qBittorrent/qBittorrent-* \
                ${XDG_CACHE_HOME}/qBittorrent \
                ${XDG_DATA_HOME}/data/qBittorrent/BT_backup
    done
;}

# Query and search
Qqs() { pacman -Qqs $1 ;}

# Query and get information
Qi() { pacman -Qi $@ ;}

# List the package(s) content
# Useful when some executable has
# different name than the package one...
Ql() { pacman -Ql $@ ;}

# List all foreign packages
Qm() { pacman -Qm ;}

# Compile, build, sign and
# install package via PKGBUILD script
mkpkg() {
    set -A chkpkg
    chkpkg=('pkg-config' 'fakeroot'
            'intltool' 'autoconf'
            'automake' 'bison'
            'flex' 'gawk'
            'gnupg'
)

    for x in "${chkpkg[@]}"
    do
        pacman -Qqn "${x}" > /dev/null 2>&1
        [[ $? != 0 ]] && {
            printf '%s\n' "Missing: "${x}", installing it for you."
            S "${x}" --noconfirm
        }
    done

    set -A key_found gawk_cmd
    # Get more than one public key in a row
    # then `source' the validpgpkeys array
    # to make the 'for' loop life easier
    gawk_cmd=(
        '/^validpgpkeys/ {
            for (x=1; x<15; x++)
            {
                print;
                getline;
                if (match($0, /)/)) {
                    if (substr($0,length,1) == ")")
                        print ")";
                    break;
                }
            }
        }'
)
    key_found=$(gawk "${gawk_cmd[@]}" PKGBUILD)

    # trust 5 quit
    [[ ! -z "${key_found}" ]] && {
        echo "${key_found[@]}" > '/tmp/delme'
        source '/tmp/delme'

        for x in ${validpgpkeys#*=}
        do
            gpg --list-keys --with-fingerprint \
                --keyid-format 0xLONG \
                    "${x}" >/dev/null 2>&1 || {
                gpg --recv-key "${x}"
                gpg --edit-key "${x}"
            }
        done
    }

    local _pkgs='/var/custompkgs'
    #[[ ! -z $1 ]] && local _pkgname=$1 || \
    #    local _pkgname=$(gawk -F '=' '/^pkgbase/ {print $2}' PKGBUILD)

    makepkg --clean --install --force --syncdeps --rmdeps --sign

    #[[ ! -z ${key_found} ]] && gpg --delete-key ${key_found}

    __fileExists *.pkg.tar.xz
    [[ $? == 0 ]] && {
        sudo cp -r *.pkg.tar.xz{,.sig} ${_pkgs}
        #sudo rm -rf /var/cache/pacman/pkg/${_pkgname}-*.tar.xz
        for x in "${_pkgs}"/*.tar.xz
        do
            sudo repo-add --quiet "${_pkgs}/custom.db.tar.gz" \
                "${x}" > /dev/null 2>&1
        done
        unset x
        Syu
    }
;}

# The purpose of this function is to
# bring more flexibillity than speed gains.
compabs() {
    __am_i_null $1 && return 1

    local match_pkg=`find /var/abs -type d -name $1`

    __am_i_null ${match_pkg} && return 1

    local pkg_basename="/tmp/${match_pkg##*/}"

    cp --recursive ${match_pkg} /tmp
    cd ${pkg_basename}
    mkpkg ${match_pkg##*/}

;}


# https://projects.archlinux.org/svntogit/packages.git/tree/
# Sometimes ABS isn't up-to-date, download
# the desired package from the SVN repo instead
compsvn() {
    __am_i_null $1 && return 1

    pacman -Qqn 'hgsvn' > /dev/null 2>&1
    [[ $? != 0 ]] && {
        printf '%s\n' "Missing: hgsvn, installing it for you."
        S 'hgsvn' --noconfirm
    }
    cd '/tmp'

    svn checkout --depth=empty svn://svn.archlinux.org/packages
    svn update "packages/$1"

    [[ ! -d "packages/$1" ]] && {
        printf '%s\n' "There is no $1 in the svn repo. Trying ABS instead."
        S 'abs' --noconfirm
        sudo abs
        compabs $1
        return 1
    }

    [[ $1 == 'linux' ]] && [[ -d "packages/$1/repos/testing-x86_64" ]] && {
        cd "packages/$1/repos/testing-x86_64"
        mkpkg $1
        return 0
    }

    cd "packages/$1/trunk"
    mkpkg $1

    rm --recursive --force "$HOME/.subversion"
}


# List orphans
orphans() { pacman -Qtdq ;}

# List explicitly installed packages.
# Explicitly means a package installed
# on purpose by you. If you don't need
# or use some package then is there are
# any particular reason to keep it ?
myshit() { pacman -Qqet ;}

# Remove all 32-bit libraries
remmulti() { R $(paclist multilib | gawk '{print $1}') ;}

######## End Of Pacman ########


# Change the system language.
# Open up '/etc/locale.gen' and uncomment
# the desired language locale(s), example:
# #de_DE.UTF-8 UTF-8 -> de_DE.UTF-8 UTF-8
# Run 'locale-gen', after that you can
# use this function. Once you 'setlang de/en'
# logout & login again.
setlang() {
  [[ $1 == 'en' ]] && local laNg='LANG="en_US.UTF-8"' \
      || local laNg='LANG="de_DE.UTF-8"'

  __WriteTo /etc/locale.conf "${laNg}"
}

# Remove all recently installed dependencies.
# A backup file before the deps. was installed
# is needed. pacman -Qqn > myoldpacks.txt
remdeps() {
    pacman -Qqn > /tmp/new
    cp -r "${dothomez}/OPEN_ME/installed_packages.txt" /tmp/old

    compare /tmp/old /tmp/new | gawk '/^+/ {if (NR > 3) {gsub("+",""); print $1 }}' > /tmp/allpacks
    Rsnc $(</tmp/allpacks)
;}

# clean /var/cache/pacman/pkg/
pkgclean() { sudo pkgcacheclean --verbose 2 ;}
```

And the `pkgcacheclean.c` program is using the following `C` code:

```c
#include <argp.h>
#include <dirent.h>
#include <inttypes.h>
#include <limits.h>
#include <regex.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#include <alpm.h>

#define ROOT "/"
#define DBPATH "/var/lib/pacman/"
#define CACHEDIR "/var/cache/pacman/pkg/"

const char *argp_program_version = "pkgcacheclean "VERSION;
const char *argp_program_bug_address = "auguste@gmail.com";

static char doc[] =
    "pkgcacheclean -- a simple utility to clean pacman cache.\v"
    "For installed packages, preserve_number of versions are reserved. This\n"
    "includes the current version and the newest (preserve_number - 1) of\n"
    "the remaining. For uninstalled packages all versions are deleted.\n"
    "The default number is 2.";
static char args_doc[] = "[preserve_number]";

static struct argp_option options[] =
{
    { .doc = "" },
    { .name = "dry-run", .key = 'n', .doc = "Perform a trial run with no changes made" },
    { .name = "cachedir", .key = 'd', .arg = "PATH",
      .doc = "Set alternative (absolute) cache directory PATH. Default is "CACHEDIR },
    { .name = "all-as-installed", .key = 'k',
      .doc = "Treat not-installed packages as installed" },
    { .name = "verbose", .key = 'v', .doc = "Verbose output" },
    { .name = "quiet", .key = 'q', .doc = "Suppress output, default" },
    { .doc = NULL }
};

static regex_t pkgnamesplit;
static regex_t pkgnametest;

struct pkginfo
{
    char *name;
    char *version;
    char *filename;
};

struct arguments
{
    int dry_run;
    int preserve;
    int keep;
    int verbose;
    char *cachedir;
};

static char *dupsubstr(const char *str, const int start, const int end)
{
    char *ret;
    const size_t len = (size_t)(end - start);

    ret = (char *)malloc(sizeof(char) * (len + 1));
    strncpy(ret, str + start, len);
    ret[len] = '\0';

    return ret;
}

static struct pkginfo * get_pkginfo_from_filename(const char * const filename)
{
    struct pkginfo *ret;
    static regmatch_t match[3];

    ret = (struct pkginfo *)malloc(sizeof(struct pkginfo));
    regexec(&pkgnamesplit, filename, 3, match, 0);
    ret->name = dupsubstr(filename, match[1].rm_so, match[1].rm_eo);
    ret->version = dupsubstr(filename, match[2].rm_so, match[2].rm_eo);
    ret->filename = strdup(filename);

    return ret;
}

static struct pkginfo * get_pkginfo_from_pmpkg(alpm_pkg_t *pmpkg)
{
    struct pkginfo *ret;

    ret = (struct pkginfo *)malloc(sizeof(struct pkginfo));
    ret->name = strdup(alpm_pkg_get_name(pmpkg));
    ret->version = strdup(alpm_pkg_get_version(pmpkg));
    ret->filename = NULL;

    return ret;
}

static void free_pkginfo(struct pkginfo * pkg)
{
    free(pkg->name);
    free(pkg->version);
    free(pkg->filename);
    free(pkg);
}

static int pkgcomp(const void *a, const void *b)
{
    struct pkginfo *ap = *(struct pkginfo **)a;
    struct pkginfo *bp = *(struct pkginfo **)b;

    int namecomp = strcmp(ap->name, bp->name);

    return namecomp ? namecomp : -alpm_pkg_vercmp(ap->version,
            bp->version);
}

static int pkgnamecomp(const void *a, const void *b)
{
    return strcmp((*(struct pkginfo **)a)->name,
            (*(struct pkginfo **)b)->name);
}

static int ispackage(const struct dirent *file)
{
    return regexec(&pkgnametest, file->d_name, 0, NULL, 0) == 0;
}

static void free_pkginfo_array(struct pkginfo **pkgs, const size_t n)
{
    size_t i;

    for (i = 0; i < n; i++)
        free_pkginfo(pkgs[i]);
    free(pkgs);
}

static off_t get_file_size(const char *filename)
{
    struct stat st;

    stat(filename, &st);
    return st.st_size;
}

static error_t parse_opt(int key, char *arg, struct argp_state *state)
{
    struct arguments *argument = (struct arguments *)(state -> input);

    switch (key)
    {
        case 'n':
            argument->dry_run = 1;
            break;
        case 'v':
            argument->verbose = 1;
            break;
        case 'k':
            argument->keep = 1;
        case 'q':
            argument->verbose = 0;
            break;
        case 'd':
            argument->cachedir = arg;
            break;
        case ARGP_KEY_ARG:
            if (argument->preserve)
                return ARGP_ERR_UNKNOWN;
            argument->preserve = atoi(arg);
            if (argument->preserve <= 0)
                return ARGP_ERR_UNKNOWN;
            break;
        default:
            return ARGP_ERR_UNKNOWN;
    }

    return 0;
}

int main(const int argc, char ** __restrict__ argv)
{
    int count = 0;
    size_t i, len, m = 0, n;
    off_t total_size = 0;
    alpm_handle_t *handle;
    struct stat st;
    struct dirent **dir;
    enum _alpm_errno_t error;
    struct pkginfo **cachepkg, **localpkg = NULL;
    struct pkginfo **hit = NULL;
    const char *current = "", *name;
    char cachedir[PATH_MAX] = CACHEDIR;
    struct argp arg_parser = { .options = options, .parser = parse_opt,
        .args_doc = args_doc, .doc = doc };
    struct arguments args = { .dry_run = 0, .preserve = 0, .keep = 0,
                              .verbose = 0, .cachedir = NULL };

    argp_parse(&arg_parser, argc, argv, 0, NULL, &args);
    if (!args.preserve)
        args.preserve = 2;

    if (!args.dry_run && getuid())
    {
        puts("please run as root.");
        exit(EXIT_FAILURE);
    }

    if (args.cachedir)
        strcpy(cachedir, args.cachedir);
    if (!((stat(cachedir, &st) == 0) && ((st.st_mode & S_IFMT) == S_IFDIR)))
    {
        printf("Cache directory does not exist or is not a valid directory: "
               "\"%s\".\n", cachedir);
        exit(EXIT_FAILURE);
    }
    len = strlen(cachedir);
    if (len && cachedir[len - 1] != '/')
    {
        cachedir[len] = '/';
        cachedir[++len] = '\0';
    }
    regcomp(&pkgnamesplit, "^(.*)-([^-]*-[^-]*)-[^-]*$", REG_EXTENDED);
    regcomp(&pkgnametest, "^.*-("CARCH"|any).[^-]*$", REG_EXTENDED);

    handle = alpm_initialize(ROOT, DBPATH, &error);

    n = (size_t)scandir(cachedir, &dir, ispackage, NULL);
    cachepkg = (struct pkginfo **)malloc(sizeof(struct pkginfo *) * n);
    for (i = 0; i < n; free(dir[i]), i++)
        cachepkg[i] = get_pkginfo_from_filename(dir[i]->d_name);
    free(dir);
    qsort(cachepkg, n, sizeof(struct pkginfo *), pkgcomp);

    if (!args.keep)
    {
        alpm_db_t *db;
        alpm_list_t *pkglist;

        db = alpm_get_localdb(handle);
        pkglist = alpm_db_get_pkgcache(db);
        m = alpm_list_count(pkglist);
        localpkg = (struct pkginfo **)malloc(sizeof(struct pkginfo *) * m);
        for (i = 0; i < m; i++, pkglist = alpm_list_next(pkglist))
            localpkg[i] = get_pkginfo_from_pmpkg((alpm_pkg_t *)(pkglist->data));
        qsort(localpkg, m, sizeof(struct pkginfo *), pkgnamecomp);
    }

    for (i = 0; i < n; i++)
    {
        name = cachepkg[i]->name;
        if (strcmp(name, current))
        {
            current = name;
            if (args.keep)
            {
                int j;
                for (j = (int)i - 1; j >= 0; j--)
                   if (pkgnamecomp(cachepkg + i, cachepkg + j))
                       break;
                hit = cachepkg + j + 1;
                count = 0;
            }
            else
            {
                hit = (struct pkginfo **)bsearch(cachepkg + i, localpkg, m,
                        sizeof(struct pkginfo *), pkgnamecomp);
                count = hit ? 0 : args.preserve;
            }
        }
        if (!hit || alpm_pkg_vercmp((*hit)->version,
                    cachepkg[i]->version))
        {
            count++;
            if (count >= args.preserve)
            {
                strcpy(cachedir + len, cachepkg[i]->filename);
                if (args.verbose)
                {
                    printf("remove: %s\n", cachepkg[i]->filename);
                    total_size += get_file_size(cachedir);
                }
                if (!args.dry_run)
                    unlink(cachedir);
            }
        }
    }

    if (args.verbose)
        printf("\ntotal: %"PRIuMAX" bytes\n", (uintmax_t)total_size);

    free_pkginfo_array(cachepkg, n);
    if (!args.keep)
        free_pkginfo_array(localpkg, m);

    alpm_release(handle);
    regfree(&pkgnametest);
    regfree(&pkgnamesplit);

    return EXIT_SUCCESS;
}
```

And compile the above code with:

```bash
gcc -o pkgcacheclean -DVERSION=\"1.8.2\" -DCARCH=\"x86_64\" \ pkgcacheclean.c -lalpm
```