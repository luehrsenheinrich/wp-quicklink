/**
 * External dependencies
 */
const { getCategories, setCategories } = wp.blocks;
import icons from './icons';

/**
 * Internal dependencies
 */

setCategories( [
	// Add a WP Munich block category
	{
		slug: 'wpmunich',
		title: 'WP Munich',
		icon: icons.wpmunich,
	},
	...getCategories().filter( ( { slug } ) => slug !== 'wpmunich' ),
] );
