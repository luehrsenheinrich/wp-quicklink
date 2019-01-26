import quicklink from "quicklink/dist/quicklink.mjs";

document.addEventListener( "DOMContentLoaded", () => {

	const exportedOptions = window.quicklinkOptions || {};

	const options = {};

	// el: Convert selector into element reference.
	if ( typeof exportedOptions.el === 'string' ) {
		options.el = document.querySelector( exportedOptions.el );
	}

	// urls: Verify we don't get an empty array, as that would turn off quicklink.
	if ( Array.isArray( exportedOptions.urls ) &&exportedOptions.urls.length > 0 ) {
		options.urls = exportedOptions.urls;
	}

	// timeout: Verify we actually get an int for milliseconds.
	if ( typeof exportedOptions.timeout === 'number' ) {
		options.timeout = exportedOptions.timeout;
	}

	// timeoutFn: Obtain function reference as opposed to function string, if it is not the default.
	if ( typeof exportedOptions.timeoutFn === 'string' && 'requestIdleCallback' !== exportedOptions.timeoutFn ) {
		const timeoutFn = window[ exportedOptions.timeoutFn ];
		options.timeoutFn = function () {
			return timeoutFn.apply( window, arguments );
		};
	}

	// priority: Obtain priority.
	if ( typeof exportedOptions.priority === 'boolean' ) {
		options.priority = exportedOptions.priority;
	}

	// origins: Verify we don't get an empty array, as that would turn off quicklink.
	if ( Array.isArray( exportedOptions.origins ) && exportedOptions.origins.length > 0 ) {
		options.origins = exportedOptions.origins;
	}

	// ignores: Convert strings to regular expressions.
	if ( Array.isArray( exportedOptions.ignores ) && exportedOptions.ignores.length > 0 ) {
		options.ignores = exportedOptions.ignores.map( ( ignore ) => {
			return new RegExp( ignore );
		} );
	}

	quicklink( options );
} );
