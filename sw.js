// ISO-PIPE — funcionamento offline. Mude VERSAO quando publicar arquivos novos.
const VERSAO='isopipe-v19';
const ARQUIVOS=['./','index.html','manifest.webmanifest','lib/xlsx.full.min.js','lib/pdf.min.js','lib/pdf.worker.min.js','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSAO).then(c=>c.addAll(ARQUIVOS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSAO).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  // Página: tenta a rede (pega atualizações) e cai no cache sem internet. Demais arquivos: cache primeiro.
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(VERSAO).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSAO).then(c=>c.put(r,cp))}return res})))});
