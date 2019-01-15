/**
 * BLOCK: split-block
 * TIER: FREE
 *
 * Provide the js for the frontend of this block
 */
import Parallax from './../vendor/parallax.js';

jQuery(document).ready( ( $ ) => {
	$('.wp-block-wpm-split.has-parallax > .split-image-wrapper').each( ( index, element ) => {

		let bgImg = $("img.split-image", element).attr('src');

		$(element).parallax({
			imageSrc: bgImg,
			mirrorContainer: element,
			zIndex: 0,
		});
	});
} );
