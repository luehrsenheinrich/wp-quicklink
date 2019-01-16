import quicklink from "quicklink/dist/quicklink.mjs";

// Apply some common sense rules
quicklink({
	ignores: [
		/feed=/, // Do not preload feed links
		(uri, elem) => {
			// Do not preload self
			const href = window.location.href;
 			return href === uri;
		},
		uri => uri.includes( window.location.href + '#' ), // ignore self with hash
	]
});
