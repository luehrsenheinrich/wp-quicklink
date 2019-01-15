/**
 * BLOCK: background-block
 * TIER: FREE
 *
 * Provide the js for the frontend of this block
 */
import Parallax from './../vendor/parallax.js';

jQuery(document).ready( ( $ ) => {
	$('.wp-block-wpm-background.has-parallax > .background-image').each( ( index, element ) => {

		let bgImg = $(element).css('background-image');
		bgImg = bgImg.replace('url(','').replace(')','').replace(/\"/gi, "");

		$(element).parallax({
			imageSrc: bgImg,
			mirrorContainer: element,
		});
	});
} );
