<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @package    wpm_blocks
 * @subpackage wpm_blocks/theme-compatibility
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 */
class WPM_Theme_Compatibility {

	/**
	 * The static varible to hold the only instance of this class
	 *
	 * @var array
	 */
	protected static $instances = array();

	/**
	 * __construct function.
	 *
	 * @access public
	 * @return void
	 */
	protected function __construct() {
		$this->action_dispatcher();
		$this->filter_dispatcher();
	}

	/**
	 * Blocked function for singleton pattern
	 */
	protected function __clone() {}

	/**
	 * Blocked function for singleton pattern
	 */
	protected function __wakeup() {}

	/**
	 * Call this method to get singleton
	 *
	 * @return UserFactory
	 */
	public static function get_instance() {
		$cls = get_called_class(); // late-static-bound class name.
		if ( ! isset( self::$instances[ $cls ] ) ) {
			self::$instances[ $cls ] = new static();
		}
		return self::$instances[ $cls ];
	}

	/**
	 * The action dispatcher for this class.
	 *
	 * @access private
	 * @return void
	 */
	private function action_dispatcher() {
		add_action( 'init', array( $this, 'register_compatibility_styles' ) );
		add_action( 'enqueue_block_assets', array( $this, 'enqueue_compatibility_styles' ) );
	}

	/**
	 * The filter dispatcher for this class.
	 *
	 * @access private
	 * @return void
	 */
	private function filter_dispatcher() {

	}

	/**
	 * Register the compatibility styles for later use
	 */
	public function register_compatibility_styles() {

		// Compatibility styles for twentyninteen.
		wp_register_style(
			'wpm-blocks-compatibility-twentynineteen',
			WPM_BLOCKS_URL . 'theme-compatibility/css/twentynineteen.min.css',
			array(),
			'<##= pkg.version ##>'
		);

	}

	/**
	 * Enqueue the compatibility styles for the current active theme
	 */
	public function enqueue_compatibility_styles() {
		$theme_stylesheet_name = wp_get_theme()->get_stylesheet();

		wp_enqueue_style( 'wpm-blocks-compatibility-' . $theme_stylesheet_name );
	}
}
