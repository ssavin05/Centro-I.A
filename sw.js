/* Cache only explicitly public assets. Auth, RPC responses and private pages stay on the network. */
const CACHE='centro-ia-public-34';
const ROOT=new URL('./',self.location.href);
const FILES=['offline.html','design-tokens.css','site.css','workspace.css','studio.css','operations.css','growth.css','assets/icons/centro-ia.svg','assets/icons/workspace.svg'];
const PUBLIC=new Set(FILES.map(name=>new URL(name,ROOT).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...PUBLIC]))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('centro-ia-public-')&&key!==CACHE).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==ROOT.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).catch(()=>caches.open(CACHE).then(cache=>cache.match(new URL('offline.html',ROOT).href))));return;
 }
 if(!PUBLIC.has(url.href))return;
 event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;}).catch(()=>caches.open(CACHE).then(cache=>cache.match(request))));
});
