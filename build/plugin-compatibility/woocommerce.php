<?php
/**
 * The plugin compatibility for the WooCommerce plugin
 *
 * @package quicklink
 */

/**
 * The function that extends the default quicklink options for WooCommerce
 *
 * @param  array $options The default Quicklink options.
 *
 * @return array          The extended Quicklink options
 */
function quicklink_woocommerce_compatibility( $options ) {
	// Check if the WooCommerce class exists.
	if ( ! class_exists( 'WooCommerce' ) ) {
		return $options;
	}

	// Get the $woocommerce object.
	global $woocommerce;

	// Do not preload 'add to cart' links.
	$wc_ignores[] = preg_quote( 'add-to-cart=', '/' );

	// Do not preload the 'my account' page, as it is usually ressource heavy.
	$myaccount_page_id = get_option( 'woocommerce_myaccount_page_id' );
	if ( $myaccount_page_id ) {
		$wc_ignores[] = preg_quote( wp_parse_url( get_permalink( $myaccount_page_id ), PHP_URL_PATH ), '/' );
	}

	// Do not preload the cart, as it is usally ressource heavy.
	$wc_ignores[] = preg_quote( wp_parse_url( $woocommerce->cart->get_cart_url(), PHP_URL_PATH ), '/' );

	// Do not preload the checkout url for the same reason as above.
	$wc_ignores[] = preg_quote( wp_parse_url( $woocommerce->cart->get_checkout_url(), PHP_URL_PATH ), '/' );

	// Do not preload the 'Payment' page, as it is usually ressource heavy.
	if ( woocommerce_get_page_id( 'pay' ) ) {
		$wc_ignores[] = preg_quote( wp_parse_url( get_permalink( woocommerce_get_page_id( 'pay' ) ), PHP_URL_PATH ), '/' );
	}

	$options['ignores'] = array_merge( $options['ignores'], array_filter( $wc_ignores ) );

	return $options;
}
add_filter( 'quicklink_options', 'quicklink_woocommerce_compatibility' );
