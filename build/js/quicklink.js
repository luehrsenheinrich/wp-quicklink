import * as quicklink from 'quicklink';

// Move quicklink to the global scope
window.quicklink = quicklink;

window.addEventListener( 'load', () => {
	const exportedOptions = window.quicklinkOptions || {};
	const prefetchQueue = window.quicklinkPrefetch || {};

	const listenerOptions = {};

	// el: Convert selector into element reference.
	if ( 'string' === typeof exportedOptions.el && exportedOptions.el ) {
		listenerOptions.el = document.querySelector( exportedOptions.el );
	}

	// timeout: Verify we actually get an int for milliseconds.
	if ( 'number' === typeof exportedOptions.timeout ) {
		listenerOptions.timeout = exportedOptions.timeout;
	}

	// limit: Verify we actually get an int.
	if ( 'number' === typeof exportedOptions.limit && exportedOptions.limit > 0 ) {
		listenerOptions.limit = exportedOptions.limit;
	}

	// throttle: Verify we actually get an int.
	if ( 'number' === typeof exportedOptions.throttle && exportedOptions.throttle > 0 ) {
		listenerOptions.throttle = exportedOptions.throttle;
	}

	// timeoutFn: Obtain function reference as opposed to function string, if it is not the default.
	if ( 'string' === typeof exportedOptions.timeoutFn && 'requestIdleCallback' !== exportedOptions.timeoutFn && typeof 'function' === window[ exportedOptions.timeoutFn ] ) {
		const timeoutFn = window[ exportedOptions.timeoutFn ];
		listenerOptions.timeoutFn = function() {
			return timeoutFn.apply( window, arguments );
		};
	}

	// onError: Obtain function reference as opposed to function string, if it is not the default.
	if ( 'string' === typeof exportedOptions.onError && 'requestIdleCallback' !== exportedOptions.onError && typeof 'function' === window[ exportedOptions.onError ] ) {
		const onError = window[ exportedOptions.onError ];
		listenerOptions.onError = function() {
			return onError.apply( window, arguments );
		};
	}

	// priority: Obtain priority.
	if ( 'boolean' === typeof exportedOptions.priority ) {
		listenerOptions.priority = exportedOptions.priority;
	}

	// origins: Verify we don't get an empty array, as that would turn off quicklink.
	if ( Array.isArray( exportedOptions.origins ) && 0 < exportedOptions.origins.length ) {
		listenerOptions.origins = exportedOptions.origins;
	}

	// ignores: Convert strings to regular expressions.
	if ( Array.isArray( exportedOptions.ignores ) && 0 < exportedOptions.ignores.length ) {
		listenerOptions.ignores = exportedOptions.ignores.map( ( ignore ) => {
			return new RegExp( ignore );
		} );
	}

	quicklink.listen( listenerOptions );

	/**
	 * The option to prefetch urls from the options is deprecated as of version 0.8.0.
	 */
	if ( Array.isArray( exportedOptions.urls ) && 0 < exportedOptions.urls.length ) {
		quicklink.prefetch( exportedOptions.urls );
	}

	/**
	 * Handle the prefetch queue.
	 */
	if ( Array.isArray( prefetchQueue ) ) {
		for ( const { url, isPriority } of prefetchQueue ) {
			quicklink.prefetch( url, isPriority );
		}
	}
} );
