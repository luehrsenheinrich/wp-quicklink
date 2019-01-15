<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @package    wpm_blocks
 * @subpackage wpm_blocks/inc
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
class WPM_Blocks {

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

		add_action( 'init', array( $this, 'register_scripts_styles' ) );
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_action( 'init', array( $this, 'register_i18n' ) );

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

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
	 * Register needed scripts and styles for our free tier
	 */
	public function register_scripts_styles() {
		wp_register_script(
			'wpm-blocks-editor',
			WPM_BLOCKS_URL . 'blocks/blocks.min.js',
			array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'underscore', 'wp-date' ),
			'<##= pkg.version ##>',
			false
		);

		wp_register_script(
			'wpm-blocks-frontend',
			WPM_BLOCKS_URL . 'blocks/blocks-frontend.min.js',
			array( 'jquery' ),
			'<##= pkg.version ##>',
			true
		);

		wp_localize_script(
			'wpm-blocks-editor',
			'wpMunichBlocks',
			array(
				'plugin_url' => WPM_BLOCKS_URL,
				'site_url'   => get_home_url(),
			)
		);

		wp_register_style(
			'wpm-blocks-editor-style',
			WPM_BLOCKS_URL . 'blocks/blocks-editor.min.css',
			array(),
			'<##= pkg.version ##>'
		);

		wp_register_style(
			'wpm-blocks-style',
			WPM_BLOCKS_URL . 'blocks/blocks.min.css',
			array(),
			'<##= pkg.version ##>'
		);

		wp_register_style(
			'wpm-filter-style',
			WPM_BLOCKS_URL . 'css/filter.min.css',
			array(),
			'<##= pkg.version ##>'
		);

		if ( wpm_blocks_fs()->is_plan__premium_only( 'professional' ) ) {

			/**
			 * Register premium assets
			 */
			wp_register_script(
				'wpm-blocks-professional-editor',
				WPM_BLOCKS_URL . 'blocks-professional/blocks.min.js',
				array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'underscore', 'wp-date' ),
				'<##= pkg.version ##>',
				false
			);

			wp_register_script(
				'wpm-blocks-professional-frontend',
				WPM_BLOCKS_URL . 'blocks-professional/blocks-frontend.min.js',
				array( 'jquery' ),
				'<##= pkg.version ##>',
				true
			);

			wp_localize_script(
				'wpm-blocks-professional-editor',
				'wpMunichBlocksProfessional',
				array(
					'can_use_premium_code' => wpm_blocks_fs()->can_use_premium_code(),
				)
			);

			wp_register_style(
				'wpm-blocks-professional-editor-style',
				WPM_BLOCKS_URL . 'blocks-professional/blocks-editor.min.css',
				array(),
				'<##= pkg.version ##>'
			);

			wp_register_style(
				'wpm-blocks-professional-style',
				WPM_BLOCKS_URL . 'blocks-professional/blocks.min.css',
				array(),
				'<##= pkg.version ##>'
			);
		}
	}

	/**
	 * Enqueue needed scripts in the frontend
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		wp_enqueue_script( 'wpm-blocks-frontend' );
		wp_enqueue_style( 'wpm-filter-style' );

		if ( wpm_blocks_fs()->is_plan__premium_only( 'professional' ) ) {
			wp_enqueue_script( 'wpm-blocks-professional-frontend' );
		}
	}

	/**
	 * Register the blocks for our free tier
	 */
	public function register_blocks() {

		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		/* ### Split ### */
		register_block_type(
			'wpm/split',
			array(
				'editor_script' => 'wpm-blocks-editor',
				'editor_style'  => 'wpm-blocks-editor-style',
				'style'         => 'wpm-blocks-style',
			)
		);

		/* ### Background ### */
		register_block_type(
			'wpm/background',
			array(
				'editor_script' => 'wpm-blocks-editor',
				'editor_style'  => 'wpm-blocks-editor-style',
				'style'         => 'wpm-blocks-style',
			)
		);

		/* ### Event ### */
		register_block_type(
			'wpm/event',
			array(
				'editor_script' => 'wpm-blocks-editor',
				'editor_style'  => 'wpm-blocks-editor-style',
				'style'         => 'wpm-blocks-style',
			)
		);

		/* ### RSS ### */
		require_once WPM_BLOCKS_PATH . '/blocks/f-rss/index.php'; // Get the dynamic block callback function.
		register_block_type(
			'wpm/rss',
			array(
				'editor_script'   => 'wpm-blocks-editor',
				'editor_style'    => 'wpm-blocks-editor-style',
				'style'           => 'wpm-blocks-style',
				'render_callback' => 'wpm_render_block_f_rss',
				'attributes'      => array(
					'url'                   => array(
						'type'    => 'string',
						'default' => '',
					),
					'amount'                => array(
						'type'    => 'string',
						'default' => '4',
					),
					'textColor'             => array(
						'type'    => 'string',
						'default' => '',
					),
					'customTextColor'       => array(
						'type'    => 'string',
						'default' => '',
					),
					'backgroundColor'       => array(
						'type'    => 'string',
						'default' => '',
					),
					'customBackgroundColor' => array(
						'type'    => 'string',
						'default' => '',
					),
					'columns'               => array(
						'type'    => 'string',
						'default' => '2',
					),
				),
			)
		);

		/* ### Accordion ### */
		register_block_type(
			'wpm/accordion',
			array(
				'editor_script' => 'wpm-blocks-editor',
				'editor_style'  => 'wpm-blocks-editor-style',
				'style'         => 'wpm-blocks-style',
			)
		);

		/* ### Person ### */
		register_block_type(
			'wpm/person',
			array(
				'editor_script' => 'wpm-blocks-editor',
				'editor_style'  => 'wpm-blocks-editor-style',
				'style'         => 'wpm-blocks-style',
			)
		);

		if ( wpm_blocks_fs()->is_plan__premium_only( 'professional' ) ) {
			// Professional blocks //
			/* ### Accordion ### */
			register_block_type(
				'wpm/freemius-btn',
				array(
					'editor_script' => 'wpm-blocks-professional-editor',
					'editor_style'  => 'wpm-blocks-professional-editor-style',
					'style'         => 'wpm-blocks-professional-style',
				)
			);
		}

		wp_enqueue_style( 'wpm-filter-style' );

	}

	/**
	 * Register the text domain for our plugin
	 */
	public function register_i18n() {
		if ( function_exists( 'wp_set_script_translations' ) ) {
			wp_set_script_translations( 'wpm-blocks-editor', 'wp-munich-blocks' );
		}
	}

	/**
	 * Load the plugin text domain for translation.
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'wp-munich-blocks',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);
	}
}
