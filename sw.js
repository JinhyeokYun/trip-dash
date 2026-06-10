const CACHE="trip-202606101314";
const PRECACHE=["./"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(PRECACHE.map(u=>c.add(u)))));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const req=e.request,url=new URL(req.url);
  if(req.method!=="GET"||url.hostname==="api.github.com")return;
  if(req.mode==="navigate"){e.respondWith(caches.open(CACHE).then(async c=>{try{const net=await fetch(req);c.put("./",net.clone());return net;}catch(_){return (await c.match("./"))||(await c.match(req))||Response.error();}}));return;}
  e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(req);if(hit)return hit;try{const net=await fetch(req);if(net&&(net.ok||net.type==="opaque"))c.put(req,net.clone());return net;}catch(_){return hit||Response.error();}}));
});
