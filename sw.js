/*
 Copyright 2014 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

/* Port to es6 when most browsers support native es6
   Mobile debugging chrome://serviceworker-internals/ */

   var expectedCache = '7.0.4.6.4.5.2';
   var webPage = 'https://su8.github.io';
   var redirect = '<meta http-equiv="refresh" content="0; url=' + webPage + '/">';
   var rssContentType = 'application/rss+xml, application/rdf+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8; charset=utf-8';
   var filesToCache = [
       './index.html',
       './js/config.js',
       './js/blog-engine.min.js',
       './js/post-engine.min.js',
       './img/icons/icon.ico',
       './manifest.json',
       './img/offline.jpg',
       './xml/xml-stylesheet.css'
   ];
   
   self.addEventListener('install', function (event) {
     event.waitUntil(
       caches.open(expectedCache).then(function(cache) {
         console.log(expectedCache);
         return cache.addAll(filesToCache);
       })
     );
   });
   
   self.addEventListener('activate', function (event) {
     event.waitUntil(
       caches.keys().then(function(cacheNames) {
         return Promise.all(cacheNames
           .filter(function(oldCache) {
             return oldCache !== expectedCache;
           })
           .map(function(oldCache) {
             return caches.delete(oldCache);
           })
         );
       })
     );
   });
   
   function itsImgRequest(req) {
     return (/\/img\/file/.test(req));
   }
   
   function genResponse(content, contentType) {
     return new Response(content, {
       headers: {
         'content-type': contentType
       }
     });
   }
   
   self.addEventListener('fetch', function(event) {
     var req = new URL(event.request.clone().url);
     event.respondWith(
       caches.open(expectedCache).then(function(cache) {
         return cache.match(event.request).then(function(response) {
           return response || fetch(event.request.clone())
           .then(function(resp) {
             if (!(itsImgRequest(req.pathname))) {
               if (resp.status === 404) {
                 return genResponse(redirect, 'text/html');
               }
               cache.put(event.request, resp.clone());
             }
             return resp;
           }).catch(function() {
             if (itsImgRequest(req.pathname)) {
               return cache.match('./img/offline.jpg');
             }
           });
         }).catch(function(error) {
           throw error;
         });
       })
     );
   });
   
   function genFeed(arr) {
     var head = [
       '<?xml version="1.0" encoding="UTF-8" ?>',
       '<?xml-stylesheet type="text/css" href="./xml/xml-stylesheet.css" ?>',
       '<rss version="2.0"><channel>',
         '<title>Linux Blog</title>',
         '<link>' + webPage + '</link>',
         '<description>Useful Linux Tips</description>'
     ].join('');
     var bottom = '</channel></rss>';
   
     var toNuke = ['\"', "'", '?', '&', '=', '^', '!', '@',
       ' #', '%', '*', '~', '(', ')', '{', '}', '<', '>',
       '[', ']', '|', ':', ' ; ', '$', '/', '\\'
     ];
     var nukeLen = toNuke.length;
     var x = 0;
   
     var content = arr.map(function(el) {
       var elem = el[1];
       x = nukeLen;
       while (x--) {
         elem = elem.split(toNuke[x]).join('');
       }
       return [
         '<item>',
           '<title>' + elem + '</title>',
           '<link>' + webPage + '/#!post=' + el[0] + '</link>',
           '<description>' + elem + '</description>',
         '</item>'
       ].join('');
   
     }).join('');
   
     return (head + content + bottom);
   }
   
   self.addEventListener('message', function(event) {
     var sitemap = JSON.parse(event.data);
     var startLen = sitemap.length;
     caches.open(expectedCache).then(function(cache) {
       cache.put('./sitemap.xml', genResponse(
         genFeed(sitemap), rssContentType));
       if (startLen >= 10) {
         var arr = [],
           end = startLen - 10,
           num = 0;
         while (startLen-- > end) {
           arr[num++] = sitemap[startLen];
         }
         cache.put('./feed.xml', genResponse(
           genFeed(arr), rssContentType));
       }
     });
   });
