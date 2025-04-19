// This is the service worker for the Bricool application

// Cache names
const CACHE_NAME = "bricool-cache-v1"
const DATA_CACHE_NAME = "bricool-data-cache-v1"

// Assets to cache
const STATIC_ASSETS = [
  "/",
  "/intro",
  "/login",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/offline.html",
]

// Install event
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Install")

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Caching app shell")
      return cache.addAll(STATIC_ASSETS)
    }),
  )

  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activate")

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key)
            return caches.delete(key)
          }
        }),
      )
    }),
  )

  self.clients.claim()
})

// Fetch event
self.addEventListener("fetch", (event) => {
  console.log("[ServiceWorker] Fetch", event.request.url)

  // For API requests, try network first, then cache
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // If response is valid, clone and store in cache
            if (response.status === 200) {
              cache.put(event.request.url, response.clone())
            }
            return response
          })
          .catch((err) => {
            // If network request fails, try to get from cache
            return cache.match(event.request)
          })
      }),
    )
    return
  }

  // For non-API requests, use "cache first, falling back to network" strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request)
          .then((response) => {
            // If request is for an image, cache it
            if (
              response.status === 200 &&
              (event.request.url.endsWith(".jpg") ||
                event.request.url.endsWith(".jpeg") ||
                event.request.url.endsWith(".png") ||
                event.request.url.endsWith(".svg"))
            ) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone)
              })
            }
            return response
          })
          .catch(() => {
            // If both cache and network fail, show offline page
            if (event.request.mode === "navigate") {
              return caches.match("/offline.html")
            }

            // For image requests that fail, return a placeholder
            if (event.request.destination === "image") {
              return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="300" fill="#eee"/><text x="200" y="150" font-family="Arial" font-size="20" text-anchor="middle" fill="#999">Image Unavailable</text></svg>',
                {
                  headers: { "Content-Type": "image/svg+xml" },
                },
              )
            }
          })
      )
    }),
  )
})

// Push event
self.addEventListener("push", (event) => {
  console.log("[ServiceWorker] Push Received.")
  console.log(`[ServiceWorker] Push had this data: "${event.data.text()}"`)

  let data = {}
  try {
    data = event.data.json()
  } catch (e) {
    data = {
      title: "Bricool",
      body: event.data.text(),
      icon: "/icons/icon-192x192.png",
    }
  }

  const title = data.title || "Bricool"
  const options = {
    body: data.body || "تم استلام إشعار جديد",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    data: {
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("[ServiceWorker] Notification click received.")

  event.notification.close()

  event.waitUntil(clients.openWindow(event.notification.data.url || "/"))
})
