// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "kantinho-offline"

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html"

self.addEventListener("install", (event) => {
  console.log("[PWA] Install Event processing")

  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      console.log("[PWA] Cached offline page during install")

      if (offlineFallbackPage === "offline.html") {
        return cache.add(new Response("Kantinho Delícia - Modo Offline"))
      }

      return cache.add(offlineFallbackPage)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        console.log("[PWA] Network request for ", event.request.url)

        // Return the response
        return response
      })
      .catch((error) => {
        // The following validates that the request was for a navigation to a new document
        if (event.request.destination !== "document" || event.request.mode !== "navigate") {
          return
        }

        console.log("[PWA] Fetch failed; returning offline page instead.", error)

        return caches.open(CACHE).then((cache) => cache.match(offlineFallbackPage))
      }),
  )
})

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", () => {
  const offlinePageRequest = new Request(offlineFallbackPage)

  return fetch(offlineFallbackPage).then((response) =>
    caches.open(CACHE).then((cache) => {
      console.log("[PWA] Offline page updated from refreshOffline event: " + response.url)
      return cache.put(offlinePageRequest, response)
    }),
  )
})
