/**
 * BLOCK: freemius-btn-block
 * TIER: Professional
 *
 * Provide the js for the frontend of this block
 */
jQuery( document ).ready( ($) => {

	let buttons = [];

	// See if we actually have freemius buttons and collect the data
	$('.wp-block-wpm-freemius-btn').each( ( index, elem ) => {
		let button = {
			selector: $( elem ),
			plugin_id: $( elem ).attr( 'data-plugin-id' ),
			plan_id: $( elem ).attr( 'data-plan-id' ),
			public_key: $( elem ).attr( 'data-public-key' ),
		}

		buttons.push( button );
	});

	// If we actually have buttons, start loading the js sdk
	if ( typeof buttons === 'object' && buttons.length > 0 ) {
		const freemiusCheckoutScript = 'https://checkout.freemius.com/checkout.min.js';

		// Load the script
		$.getScript( freemiusCheckoutScript, () => {

			$.each( buttons, ( index, elem ) => {
				let handler = {};

				// Setup the checkout handler for the public key (we can have more than one public key on the page)
				handler[ elem.public_key ] = FS.Checkout.configure({
					plugin_id: elem.plugin_id,
					plan_id: elem.plan_id,
					public_key: elem.public_key,
				});

				// Bind the handler to the onclick event
				$( elem.selector ).on( 'click', ( e ) => {

					handler[ elem.public_key ].open({
						plan_id: elem.plan_id,
						plugin_id: elem.plugin_id,
					});

					e.preventDefault();
				});

			});
		});
	}

});
