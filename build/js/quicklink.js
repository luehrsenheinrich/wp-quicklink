import quicklink from 'quicklink/dist/quicklink.mjs';

document.addEventListener( 'DOMContentLoaded', () => {
	const exportedOptions = window.quicklinkOptions || {};

	const options = {};

	// el: Convert selector into element reference.
	if ( 'string' === typeof exportedOptions.el && exportedOptions.el ) {
		options.el = document.querySelector( exportedOptions.el );
	}

	// urls: Verify we don't get an empty array, as that would turn off quicklink.
	if ( Array.isArray( exportedOptions.urls ) && 0 < exportedOptions.urls.length ) {
		options.urls = exportedOptions.urls;
	}

	// timeout: Verify we actually get an int for milliseconds.
	if ( 'number' === typeof exportedOptions.timeout ) {
		options.timeout = exportedOptions.timeout;
	}

	// timeoutFn: Obtain function reference as opposed to function string, if it is not the default.
	if ( 'string' === typeof exportedOptions.timeoutFn && 'requestIdleCallback' !== exportedOptions.timeoutFn ) {
		const timeoutFn = window[ exportedOptions.timeoutFn ];
		options.timeoutFn = function() {
			return timeoutFn.apply( window, arguments );
		};
	}

	// priority: Obtain priority.
	if ( 'boolean' === typeof exportedOptions.priority ) {
		options.priority = exportedOptions.priority;
	}

	// origins: Verify we don't get an empty array, as that would turn off quicklink.
	if ( Array.isArray( exportedOptions.origins ) && 0 < exportedOptions.origins.length ) {
		options.origins = exportedOptions.origins;
	}

	// ignores: Convert strings to regular expressions.
	if ( Array.isArray( exportedOptions.ignores ) && 0 < exportedOptions.ignores.length ) {
		options.ignores = exportedOptions.ignores.map( ( ignore ) => {
			return new RegExp( ignore );
		} );
	}

	quicklink( options );
} );
