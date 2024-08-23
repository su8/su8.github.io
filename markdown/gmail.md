
---

Query gmail and show all unread emails, can be combined to i3, conky or other programs.

Make sure that you have not blocked the requests by turning the following option on - https://myaccount.google.com/lesssecureapps , once it's on wait 5 minutes before you make a request.

```bash
git clone https://github.com/su8/query-gmail
make ACC="foo" PASS="bar"
sudo make install
# and type `mail' to use it
```
