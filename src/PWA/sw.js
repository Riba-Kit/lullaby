// These JavaScript module imports need to be bundled:
import {precacheAndRoute} from 'workbox-precaching';
import {registerRoute} from 'workbox-routing';
import {
	CacheFirst,
	NetworkFirst,
	NetworkOnly,
	StaleWhileRevalidate
} from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

console.log('================SW VERSION 1================');

registerRoute(
	// Cache json files.
	/.+manifest\.json$/,
	// Use the cache if it's available.
	new NetworkFirst()
);
registerRoute(
	// Cache json files.
	/.+sw\.js$/,
	// Use the cache if it's available.
	new NetworkFirst()
);

registerRoute(
	// Cache image files.
	({request}) => request.destination === 'image',
	// Use the cache if it's available.
	new CacheFirst({
		// Use a custom cache name.
		cacheName: 'image-cache',
		// plugins: [
		// 	new ExpirationPlugin({
		// 		// Cache only 200 images.
		// 		maxEntries: 200,
		// 		// Cache for a maximum of a week.
		// 		maxAgeSeconds: 7 * 24 * 60 * 60,
		// 	})
		// ],
	})
);

registerRoute(
	// Cache image files.
	/.+\.(mp3)$/,
	// Use the cache if it's available.
	new CacheFirst({
		// Use a custom cache name.
		cacheName: 'audio-cache',
		// plugins: [
		// 	new ExpirationPlugin({
		// 		// Cache only 200 images.
		// 		maxEntries: 200,
		// 		// Cache for a maximum of a week.
		// 		maxAgeSeconds: 7 * 24 * 60 * 60,
		// 	})
		// ],
	})
);

registerRoute(
	// Cache image files.
	({request}) => request.destination === 'document',
	// Use the cache if it's available.
	new StaleWhileRevalidate({
		// Use a custom cache name.
		cacheName: 'html-cache',
	})
);

registerRoute(
	// Cache json files.
	/.+\.json$/,
	// Use the cache if it's available.
	new CacheFirst({
		// Use a custom cache name.
		cacheName: 'json-cache',
	})
);