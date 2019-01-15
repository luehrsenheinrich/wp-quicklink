/**
 * BLOCK: background-block
 * TIER: FREE
 *
 * Provide the js for the frontend of this block
 */
jQuery(document).ready( ( $ ) => {
	$('.wp-block-wpm-accordion .accordion-header').click( function() {
		let openClass   = 'is-open';
		let parent        = $(this).parent();
		let accordionBody = $('.accordion-content-body', parent);

		accordionBody.slideToggle({
			done: function() {
				parent.toggleClass( openClass );
			}
		})
	});
} );
