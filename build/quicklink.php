<?php
/**
 * The main file of the <##= pkg.title ##> plugin
 *
 * @package quicklink
 * @version <##= pkg.version ##>
 *
 * Plugin Name: <##= pkg.title ##>
 * Plugin URI: <##= pkg.pluginUrl ##>
 * Description: <##= pkg.shortDesc ##>
 * Author: <##= pkg.author ##>
 * Author URI: <##= pkg.authorUrl ##>
 * Version: <##= pkg.version ##>
 * Text Domain: quicklink
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}


define( 'QUICKLINK_URL', plugin_dir_url( __FILE__ ) );
define( 'QUICKLINK_PATH', plugin_dir_path( __FILE__ ) );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-plugin-name-activator.php
 */
function activate_quicklink() {

}
register_activation_hook( __FILE__, 'activate_quicklink' );

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function deactivate_quicklink() {
}
register_deactivation_hook( __FILE__, 'deactivate_quicklink' );

/**
 * Embed the scripts we need for this plugin
 */
function quicklink_enqueue_scripts() {
	// Abort if the response is AMP since custom JavaScript isn't allowed and Quicklink functionality would be part of the AMP runtime.
	if ( function_exists( 'is_amp_endpoint' ) && is_amp_endpoint() ) {
		return;
	}

	wp_enqueue_script( 'quicklink', QUICKLINK_URL . 'quicklink.min.js', array(), '<##= pkg.version ##>', true );
}
add_action( 'wp_enqueue_scripts', 'quicklink_enqueue_scripts' );
