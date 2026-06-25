// Service worker — 紐約家庭之旅 / 探險家
// 策略：app shell 預快取 + stale-while-revalidate（先回快取、瞬間渲染，背景再更新）
// 解決「剛部署 / 慢網時，因 network-first 無逾時，CSS 載入慢導致底部導航列晚出現」
const C = 'nyc-trip-v2';
const SHELL = [
  './', './index.html', './itinerary.html', './kids.html',
  './css/kids.css', './js/kids.data.js', './js/kids.js'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(C).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // 跨源（地圖等）不攔截，避免拖慢
  e.respondWith(
    caches.open(C).then(cache =>
      cache.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network; // 有快取→瞬間回；沒有→等網路
      })
    )
  );
});
