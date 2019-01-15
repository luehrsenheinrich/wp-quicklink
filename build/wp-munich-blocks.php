<?php
/**
 * The main file of the <##= pkg.title ##> plugin
 *
 * @package wpm_blocks
 * @version <##= pkg.version ##>
 *
 * Plugin Name: <##= pkg.title ##>
 * Plugin URI: <##= pkg.pluginUrl ##>
 * Description: <##= pkg.shortDesc ##>
 * Author: <##= pkg.author ##>
 * Author URI: <##= pkg.authorUrl ##>
 * Version: <##= pkg.version ##>
 * Text Domain: wp-munich-blocks
 *
 * @fs_premium_only /blocks-professional/, /blocks-enterprise/
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( function_exists( 'wpm_blocks_fs' ) ) {
	wpm_blocks_fs()->set_basename( true, __FILE__ );
	return;
}

define( 'WPM_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
define( 'WPM_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-plugin-name-activator.php
 */
function activate_wpm_blocks() {

}
register_activation_hook( __FILE__, 'activate_wpm_blocks' );

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-plugin-name-deactivator.php
 */
function deactivate_wpm_blocks() {

}
register_deactivation_hook( __FILE__, 'deactivate_wpm_blocks' );

/**
 * Global helper functions.
 */
require plugin_dir_path( __FILE__ ) . 'inc/functions.php';

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'inc/class-wpm-blocks.php';
require plugin_dir_path( __FILE__ ) . 'inc/class-wpm-image-filter.php';
require plugin_dir_path( __FILE__ ) . 'theme-compatibility/class-wpm-theme-compatibility.php';

$globals['wpm_blocks']              = WPM_Blocks::get_instance();
$globals['wpm_image_filter']        = WPM_Image_Filter::get_instance();
$globals['wpm_theme_compatibility'] = WPM_Theme_Compatibility::get_instance();

if ( ! function_exists( 'wpm_blocks_fs' ) ) {

	/**
	 * Create a helper function for easy SDK access.
	 */
	function wpm_blocks_fs() {
		global $wpm_blocks_fs;

		if ( ! isset( $wpm_blocks_fs ) ) {
			// Activate multisite network integration.
			if ( ! defined( 'WP_FS__PRODUCT_2839_MULTISITE' ) ) {
					define( 'WP_FS__PRODUCT_2839_MULTISITE', true );
			}

			// Include Freemius SDK.
			require_once dirname( __FILE__ ) . '/freemius/start.php';

			$wpm_blocks_fs = fs_dynamic_init(
				array(
					'id'                  => '2839',
					'slug'                => 'wp-munich-blocks',
					'type'                => 'plugin',
					'public_key'          => 'pk_8af87d0feb48a88d277c8aa9e3274',
					'is_premium'          => true,
					// If your plugin is a serviceware, set this option to false.
					'has_premium_version' => true,
					'has_addons'          => false,
					'has_paid_plans'      => true,
					'menu'                => array(
						'first-path' => 'plugins.php',
					),
					// Set the SDK to work in a sandbox mode (for development & testing).
					// IMPORTANT: MAKE SURE TO REMOVE SECRET KEY BEFORE DEPLOYMENT.
					'secret_key'          => 'sk_?5}M}WS4fiR@^OjnHL&iD=?@DPGkl',
				)
			);
		}

		return $wpm_blocks_fs;
	}

	// Init Freemius.
	wpm_blocks_fs();
	// Signal that SDK was initiated.
	do_action( 'wpm_blocks_fs_loaded' );
}


/**
 * The definition of the theme icon URL.
 *
 * @return string The theme icon url.
 */
function wpm_define_theme_icon() {
	return dirname( __FILE__ ) . '/img/wp-munich-300.png';
}
wpm_blocks_fs()->add_filter( 'plugin_icon', 'wpm_define_theme_icon' );
