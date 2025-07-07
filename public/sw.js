// Service Worker for JSF Inventory Management
const CACHE_NAME = 'jsf-inventory-v1';
const urlsToCache = [
  '/',
  '/login',
  '/inventory',
  '/staff',
  '/reports',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
	caches.open(CACHE_NAME)
	  .then((cache) => {
		console.log('Opened cache');
		return cache.addAll(urlsToCache);
	  })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
	caches.match(event.request)
	  .then((response) => {
		// Return cached version or fetch from network
		return response || fetch(event.request)
		  .then((response) => {
			// Check if we received a valid response
			if (!response || response.status !== 200 || response.type !== 'basic') {
			  return response;
			}

			// Clone the response
			const responseToCache = response.clone();

			caches.open(CACHE_NAME)
			  .then((cache) => {
				cache.put(event.request, responseToCache);
			  });

			return response;
		  })
		  .catch(() => {
			// Return offline page for navigation requests
			if (event.request.mode === 'navigate') {
			  return caches.match('/');
			}
		  });
	  })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
	caches.keys().then((cacheNames) => {
	  return Promise.all(
		cacheNames.map((cacheName) => {
		  if (cacheName !== CACHE_NAME) {
			console.log('Deleting old cache:', cacheName);
			return caches.delete(cacheName);
		  }
		})
	  );
	})
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
	event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
	// Sync any pending data when connection is restored
	const pendingData = await getPendingData();
	
	for (const data of pendingData) {
	  try {
		await syncData(data);
		await removePendingData(data.id);
	  } catch (error) {
		console.error('Background sync failed:', error);
	  }
	}
  } catch (error) {
	console.error('Background sync error:', error);
  }
}

// Helper functions for offline data management
async function getPendingData() {
  // This would typically interact with IndexedDB
  // For now, return empty array
  return [];
}

async function syncData(data) {
  // Sync data to server
  const response = await fetch('/api/sync', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json',
	},
	body: JSON.stringify(data),
  });
  
  if (!response.ok) {
	throw new Error('Sync failed');
  }
}

async function removePendingData(id) {
  // Remove synced data from local storage
  // Implementation would depend on your storage strategy
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
	body: event.data ? event.data.text() : 'New notification from JSF Inventory',
	icon: '/icon-192x192.png',
	badge: '/icon-72x72.png',
	vibrate: [100, 50, 100],
	data: {
	  dateOfArrival: Date.now(),
	  primaryKey: 1
	},
	actions: [
	  {
		action: 'explore',
		title: 'View',
		icon: '/icon-192x192.png'
	  },
	  {
		action: 'close',
		title: 'Close',
		icon: '/icon-192x192.png'
	  }
	]
  };

  event.waitUntil(
	self.registration.showNotification('JSF Inventory', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
	event.waitUntil(
	  clients.openWindow('/')
	);
  }
}); 