/**
 * We need to update the minimum WordPress version in the main plugin file.
 * This is done by reading the plugin file, finding the lines that
 * contains the minimum WordPress version, and replacing it with the new version.
 */

/**
 * We do not want eslint to report console calls.
 */
/* eslint-disable no-console */

const fs = require( 'fs' );
const pkg = require( '../package.json' );

/**
 * Get the current WordPress version from an api call.
 */
const getWordPressVersion = () => {
	return new Promise( ( resolve, reject ) => {
		const https = require( 'https' );
		https
			.get( 'https://api.wordpress.org/core/version-check/1.7/', ( res ) => {
				let body = '';
				res.on( 'data', ( chunk ) => {
					body += chunk;
				} );
				res.on( 'end', () => {
					const parsed = JSON.parse( body );
					resolve( parsed.offers[ 0 ].version );
				} );
			} )
			.on( 'error', ( err ) => {
				reject( err );
			} );
	} );
};

/**
 * Update the minimum WordPress version in the package.json file.
 * The minimum has the key "testedWp".
 *
 * @param {string} version The new WordPress version.
 */
const updatePackageJson = ( version ) => {
	return new Promise( ( resolve, reject ) => {
		// Update the version in the pkg object.
		pkg.testedWp = version;

		// Write the new content to the file.
		fs.writeFile( `./package.json`, JSON.stringify( pkg, null, 2 ), ( err ) => {
			console.log(
				`Tested up to version in package.json update to ${ version }.`
			);

			if ( err ) {
				reject( err );
			}

			resolve();
		} );
	} );
};

getWordPressVersion().then( ( version ) => {
	updatePackageJson( version );
} );
