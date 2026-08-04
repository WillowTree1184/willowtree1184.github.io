const CACHE_NAME = 'image-cache-v1';

// 安装时：缓存关键图片（可选，也可等运行时自动缓存）
self.addEventListener('install', (event) => {
    self.skipWaiting();
    // 不预缓存也行，运行时拦截更灵活
});

// 激活时：清理旧缓存
self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
    self.clients.claim();
});

// 拦截所有图片请求，优先读缓存，没有则网络获取并写入缓存
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 只处理图片
    if (!/\.(jpg|jpeg|png|gif|webp|svg|avif|ico)(\?.*)?$/i.test(url.pathname)) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async (cache) => {
            const cached = await cache.match(request);
            if (cached) return cached;

            const response = await fetch(request);
            // 只缓存成功的 GET 请求
            if (response.ok && request.method === 'GET') {
                cache.put(request, response.clone());
            }
            return response;
        }),
    );
});
