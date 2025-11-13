
---

So dating back 2 months ago I received mention from `yccombinator-notification`, the repo was deleted and I opened my email inbox and still the blue dot about notifications was there every day when I visited github. Here is what it looked like:

![](img/file/github_mention/inbox_mentions.png)

And I found out how to fix it. Click on your notifications box and right click and select `Inspect` then click the `bug` icon and type:

```javascript
// Type

allow pasting

// after that copy and paste this script

(function(){var f=document.querySelector('.js-notifications-mark-all-actions form[action="/notifications/beta/mark"]');if(f){fetch(f.action,{method:f.method,body:new FormData(f),credentials:"include"}).then(r=>{if(r.ok)setTimeout(()=>location.reload(),500);});}})();
```

And voila: 

![](img/file/github_mention/inbox_mentions_done.png)