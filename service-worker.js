// 缓存名称
const CACHE_NAME = "webnav-cache-v1"

// 需要缓存的资源
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/data.js",
  "/manifest.json",
  "https://unpkg.com/vue@3.2.47/dist/vue.global.prod.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
]

// 安装Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// 激活Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// 拦截请求并从缓存中响应
self.addEventListener("fetch", (event) => {
  // 排除 chrome-extension 请求
  if (event.request.url.startsWith("chrome-extension://")) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request).then((response) => {
        // 检查是否为有效响应
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // 排除 chrome-extension 请求
        if (response.url.startsWith("chrome-extension://")) {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        return response
      })
    }),
  )
})

