// Service Worker for caching Swiper resources
const CACHE_NAME = 'swiper-cache-v1'
const SWIPER_RESOURCES = [
	'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css',
	'https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js',
	'./images/backgroundHero.webp',
	'./js/swiper-optimizer.js',
	'./js/app.js',
]

// Install event - cache Swiper resources
self.addEventListener('install', event => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(cache => {
				console.log('Caching Swiper resources...')
				return cache.addAll(SWIPER_RESOURCES)
			})
			.then(() => {
				console.log('Swiper resources cached successfully')
				return self.skipWaiting()
			})
			.catch(error => {
				console.error('Failed to cache Swiper resources:', error)
			})
	)
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
	event.waitUntil(
		caches
			.keys()
			.then(cacheNames => {
				return Promise.all(
					cacheNames.map(cacheName => {
						if (cacheName !== CACHE_NAME) {
							console.log('Deleting old cache:', cacheName)
							return caches.delete(cacheName)
						}
					})
				)
			})
			.then(() => {
				return self.clients.claim()
			})
	)
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
	// Only handle GET requests
	if (event.request.method !== 'GET') {
		return
	}

	// Check if request is for Swiper resources
	const isSwiper = SWIPER_RESOURCES.some(
		resource =>
			event.request.url.includes(resource) ||
			event.request.url.includes('swiper') ||
			event.request.url.includes('backgroundHero')
	)

	if (isSwiper) {
		event.respondWith(
			caches.match(event.request).then(response => {
				if (response) {
					console.log('Serving from cache:', event.request.url)
					return response
				}

				// Fetch from network and cache for future use
				return fetch(event.request)
					.then(response => {
						// Check if response is valid
						if (
							!response ||
							response.status !== 200 ||
							response.type !== 'basic'
						) {
							return response
						}

						// Clone response for caching
						const responseToCache = response.clone()

						caches.open(CACHE_NAME).then(cache => {
							cache.put(event.request, responseToCache)
						})

						return response
					})
					.catch(error => {
						console.error('Failed to fetch resource:', error)
						// Return a fallback if needed
						return new Response('Resource unavailable', { status: 503 })
					})
			})
		)
	}
})
