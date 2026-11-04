/* 四六级学习台 · Service Worker
   策略：预缓存全部资源 → 之后一律「先给缓存，后台更新」（stale-while-revalidate）。
   这样打开是瞬间的，同时下次启动会自动用上你上传的新版本。 */

const VERSION = 'cet-v1';
const CACHE = VERSION;

// 首次安装时预缓存。路径全部相对，可部署在子目录（如 /cet/）
const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  'assets/app.css',
  'assets/app.js',
  'data/cet4.js',
  'data/cet6.js',
  'data/phonetics.js',
  'data/examples.js',
  'data/exam-phrases.js',
  'data/grammar.js',
  'data/writing.js',
  'data/phrases.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // 逐个缓存：某个文件缺失不至于让整个安装失败
      let ok = 0, fail = 0;
      await Promise.all(PRECACHE.map(async url => {
        try {
          await cache.add(new Request(url, { cache: 'reload' }));
          ok++;
        } catch (e) {
          fail++;
        }
      }));
      console.log('[SW] 预缓存完成：成功 ' + ok + '，失败 ' + fail);
      // 不等旧页面关闭，立刻接管
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // 清理旧版本缓存
      const keys = await caches.keys();
      await Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      );
      await self.clients.claim();
      console.log('[SW] 已激活，缓存版本 ' + VERSION);
    })()
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // 只处理同源 GET 请求
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 网络请求必须同步发起、同步登记 waitUntil。
  // 在 await 之后调用 event.waitUntil() 会抛 InvalidStateError，
  // 进而让 respondWith 的 Promise 被拒绝，离线时会整页失败。
  const networkPromise = fetch(req).then(res => {
    if (res && res.ok && res.type === 'basic') {
      caches.open(CACHE)
        .then(c => c.put(req, res.clone()))
        .catch(() => {});
    }
    return res;
  }).catch(() => null);

  event.waitUntil(networkPromise);

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // 先给缓存，后台由上面的 networkPromise 更新
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;

    const res = await networkPromise;
    if (res) return res;

    // 离线且未缓存：导航请求退回首页，其余返回 503
    if (req.mode === 'navigate') {
      const fallback = await cache.match('index.html');
      if (fallback) return fallback;
    }
    return new Response('离线，且该资源尚未缓存', {
      status: 503,
      statusText: 'Offline',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  })());
});

// 允许页面主动要求更新
self.addEventListener('message', event => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});
