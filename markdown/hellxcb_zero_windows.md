
---

When I added counting all opened windows in each workspaces/tag I noticed that when there is only 1 window left (when I kill the rest windows in the particular tag/workspace) hellxcb shows 0 opened windows and I when I switch to other tag/workspace and go back to the previous one with 1 opened windows it counts the window as 1 properly.

Sometimes it counts correctly other times it doesn't. So I added these 2 lines in `killclient1` function to switch to the first or second tag/workspace and go back to the original one and the window counting bug is gone.

```c
change_desktop(&(Arg){.i = (currentworkspace == 0 ? 1 : 0)});
change_desktop(&(Arg){.i = prevworkspace});
```
