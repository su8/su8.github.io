
---

Reading arguments from a pipe -- you can use g/awk and `xargs`, but here I'll demonstrate it `while read` loop.

```
find / -type f -name "*.png" | while read x; do echo '\033[0;32m ' $x '\033[0m'; done
```

The above command will list all `.png` images and print their location and name with green colour.