/* PWA estática. Nunca guardar en caché cookies, respuestas API, cuentas o datos privados. */
const CACHE='centro-ia-assets-v1';
const SHELL=['/','/styles.css','/waves.css','/app.js','/manifest.webmanifest','/assets/icons/nexo-club-192.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/demo/'))return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).catch(()=>caches.match('/')));
    return;
  }
  if(!SHELL.includes(url.pathname)&&!url.pathname.startsWith('/assets/icons/'))return;
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    if(res.ok){const clone=res.clone();caches.open(CACHE).then(c=>c.put(req,clone));}
    return res;
  })));
});