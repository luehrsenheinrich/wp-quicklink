import quicklink from "quicklink/dist/quicklink.mjs";

document.addEventListener( "DOMContentLoaded", () => {

	const options = Object.assign( {}, window.quicklinkOptions );

	/* Convert selector into element reference. */
	if ( options.el ) {
		options.el = document.querySelector( options.el );
	}

	/* Convert strings to regular expressions. */
	if ( options.ignores ) {
		options.ignores = options.ignores.map( ( ignore ) => {
			return new RegExp( ignore );
		} );
	}

	/* Obtain function reference. */
	if ( options.timeoutFn && 'requestIdleCallback' !== options.timeoutFn ) {
		options.timeoutFn = window[ options.timeoutFn ];
	}

	quicklink( options );
} );
