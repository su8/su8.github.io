
---

Create a file named `cat.c`

```c
// cat - read and output files

#include <stdio.h>

#define MAX_STRING_SIZE 256

void output_file(FILE *in, FILE *out);

int main(int argc, char **argv) {
  int arg_count = argc;
  char **arguments = argv;

  if (arg_count == 1) {
    output_file(stdin, stdout);
    return 0;
  }

  FILE *read_file;
  while (--arg_count > 0) {
    read_file = fopen(*++arguments, "r");

    if (read_file == NULL) {
      perror(*arguments);
      return 1;
    }

    output_file(read_file, stdout);
    fclose(read_file);
  } // end while

}

void output_file(FILE *in, FILE *out) {
  static char buffer[MAX_STRING_SIZE];

  size_t size; // Number of bytes read by fread()
  while ( (size = fread(buffer, 1, MAX_STRING_SIZE - 1, in) ) != 0) {
    buffer[size] = '\0';
    fwrite(buffer, 1, size, out);
  }
}
```

Compile it with `gcc -Wall -Wextra -O2 -o main cat.c`.