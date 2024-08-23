
---

Query reddit and number all unread notifications, can be combined to i3, conky or other programs.

Before installation:

Replace the text within the variable FEED with your [own JSON feed](https://www.reddit.com/prefs/feeds/) copy the JSON link pointing to everything -> 

![](img/file/reddit/reddit.png)

```bash
git clone https://github.com/su8/query-reddit
make FEED="123456789"
sudo make install
# Just execute `reddit'
```
