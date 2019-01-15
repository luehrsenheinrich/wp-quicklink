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
class WPM_Image_Filter {

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
		$this->setup_filters();
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
	 * The array of filters
	 *
	 * @var array
	 */
	private $filters = array();

	/**
	 * The action dispatcher for this class.
	 *
	 * @access private
	 * @return void
	 */
	private function action_dispatcher() {
		if ( is_admin() ) {
			add_action( 'init', array( $this, 'output_filter_object' ), 11 );
		}
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
	 * Setup the filters.
	 *
	 * @return void
	 */
	private function setup_filters() {

		$this->add_image_filter(
			array(
				'title' => __( 'Original Image', 'wp-munich-blocks' ),
				'slug'  => 'none',
			)
		);

		$this->add_image_filter(
			array(
				'title' => '1977',
				'slug'  => '1977',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Aden',
				'slug'  => 'aden',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Amaro',
				'slug'  => 'amaro',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Ashby',
				'slug'  => 'ashby',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Brannan',
				'slug'  => 'brannan',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Brooklyn',
				'slug'  => 'brooklyn',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Charmes',
				'slug'  => 'charmes',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Clarendon',
				'slug'  => 'clarendon',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Crema',
				'slug'  => 'crema',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Dogpatch',
				'slug'  => 'dogpatch',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Earlybird',
				'slug'  => 'earlybird',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Gingham',
				'slug'  => 'gingham',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Ginza',
				'slug'  => 'ginza',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Hefe',
				'slug'  => 'hefe',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Helena',
				'slug'  => 'helena',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Hudson',
				'slug'  => 'hudson',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Inkwell',
				'slug'  => 'inkwell',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Kelvin',
				'slug'  => 'kelvin',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Juno',
				'slug'  => 'juno',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Lark',
				'slug'  => 'lark',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Lo-Fi',
				'slug'  => 'lofi',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Ludwig',
				'slug'  => 'ludwig',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Maven',
				'slug'  => 'maven',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Mayfair',
				'slug'  => 'mayfair',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Moon',
				'slug'  => 'moon',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Nashville',
				'slug'  => 'nashville',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Perpetua',
				'slug'  => 'perpetua',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Poprocket',
				'slug'  => 'poprocket',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Sierra',
				'slug'  => 'sierra',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Skyline',
				'slug'  => 'skyline',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Slumber',
				'slug'  => 'slumber',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Stinson',
				'slug'  => 'stinson',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Sutro',
				'slug'  => 'sutro',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Toaster',
				'slug'  => 'toaster',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Valencia',
				'slug'  => 'valencia',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Vesper',
				'slug'  => 'vesper',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Walden',
				'slug'  => 'walden',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'Willow',
				'slug'  => 'willow',
			)
		);

		$this->add_image_filter(
			array(
				'title' => 'X-Pro II',
				'slug'  => 'xpro',
			)
		);
	}

	/**
	 * Add a new image filter
	 *
	 * @param array $args The arguments of the image filter (title, slug).
	 */
	private function add_image_filter( $args ) {

		$filter = new stdClass();

		$filter->label = $args['title'];
		$filter->value = $args['slug'];

		$this->filters[] = $filter;
	}

	/**
	 * Print the filter object into
	 *
	 * @return void
	 */
	public function output_filter_object() {
		wp_localize_script(
			'wpm-blocks-editor',
			'wpMunichFilters',
			$this->filters
		);
	}
}
