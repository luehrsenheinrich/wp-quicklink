/**
 * COMMON: The file in which we define helper functions for our blocks
 * TIER: AGNCY Professional
 */

/**
 * External dependencies
 */
import { get, map, isEmpty } from 'lodash';

/**
 * Get the largest accaptable available size from an wp image object
 *
 * @param  {Object} image              The WordPress image object
 * @param  {Array}  acceptableSizes    The array of acceptable images, from least to most acceptable
 *
 * @return {Object}                    The object of the image size with details of the size.
 */
export const getLargestAvailableSize = ( image, acceptableSizes = [ 'full', 'large' ] ) => {
	let imageSize = false;
	const sizes = getAvailableSizes( image );

	if( isEmpty( sizes ) ) {
		return false;
	}

	map(acceptableSizes, (size) => {
		if( ! isEmpty( sizes[ size ] ) ) {
			imageSize = sizes[ size ];
			imageSize.size = size;
		}
	});

	return imageSize;
}

/**
 * Get the available sizes from a wp image object
 *
 * @param  {Object} image  The WordPress image object
 *
 * @return {Object}        An object with the available sizes
 */
export const getAvailableSizes = ( image ) => {

	let sizes = get( image, [ 'media_details', 'sizes' ], {} );

	// REST API and media frame are inconsistent, so we have a second place to look at
	if( isEmpty(sizes) ) {
		sizes = get( image, [ 'sizes' ], {} );
	}

	return sizes;
}
