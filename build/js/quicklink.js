import quicklink from "quicklink/dist/quicklink.mjs";

document.addEventListener( "DOMContentLoaded", () => {

	const tempOptions = Object.assign( {}, window.quicklinkOptions );
	const options = {};


	/* Convert selector into element reference. */
	if ( tempOptions.el && tempOptions.el !== '' ) {
		options.el = document.querySelector( tempOptions.el );
	}

	/* Verify we don't get an empty array, as that would turn off quicklink */
	if ( 	tempOptions.urls &&
				typeof tempOptions.urls === 'object' &&
				tempOptions.urls.length > 0
			) {
		options.urls = tempOptions.urls;
	}

	/* Verify we actually get an int for ms */
 	if ( parseInt( tempOptions.timeout ) ) {
		options.timeout = parseInt( tempOptions.timeout );
	}

	/* Obtain function reference. */
	if ( tempOptions.timeoutFn && 'requestIdleCallback' !== tempOptions.timeoutFn ) {
		options.timeoutFn = window[ tempOptions.timeoutFn ];
	}

	/* Verify we don't get an empty array, as that would turn off quicklink */
	if ( 	tempOptions.origins &&
				typeof tempOptions.origins === 'object' &&
				tempOptions.origins.length > 0
			) {
		options.origins = tempOptions.origins;
	}

	/* Convert strings to regular expressions. */
	if ( tempOptions.ignores ) {
		options.ignores = tempOptions.ignores.map( ( ignore ) => {
			return new RegExp( ignore );
		} );
	}

	console.log( options );

	quicklink( options );
} );
