
---

To create a runtime formatted strings, all you have to do is create one function that will act as `sprint`, except it wont overflow.

```c
#define VLA 256
char GLOBAL_BUF[VLA];
char *
mk_str(const char *fmt, ...) {
  char *ptr = GLOBAL_BUF;
  va_list ap;

  va_start(ap, fmt);
  vsnprintf(ptr, (size_t)VLA-1, fmt, ap);
  va_end(ap);

  return ptr;
}
```

And use it somewhere in your code like this:

```c
char *str = mk_str("%s %d", "hello", 1);
puts(str);
```

No need to declare a new variable. You can use `mk_str` multiple times and in `#define` too.