if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/journey/sw.js').then(registration => {
			console.log('SW registered: ', registration);

			registration.onupdatefound = () => {
				const installingWorker = registration.installing;
				if (installingWorker == null) {
					return;
				}
				installingWorker.onstatechange = () => {
					if (installingWorker.state === 'installed') {
						if (navigator.serviceWorker.controller) {
							// At this point, the updated precached content has been fetched,
							// but the previous service worker will still serve the older
							// content until all client tabs are closed.
							openAlertModal("Updates!", "New version available, please reopen app");

						} else {
							// At this point, everything has been precached.
							// It's the perfect time to display a
							// "Content is cached for offline use." message.
							console.log('Content is cached for offline use.');
						}
					}
				};
			};
		})
			.catch(registrationError => {
			console.log('SW registration failed: ', registrationError);
			openAlertModal('Service worker not installed!',
				'Failed to install service worker, portals may works slowly and will not works without network');
		});
	});

} else {
	openAlertModal('Service worker not supported!',
		'Current browser not supports service workers, portals may works slowly and will not works without network');
}