<?php
/**
 * PHP port of the JavaScript classNames utility. https://github.com/JedWatson/classnames
 *
 * Github: https://github.com/CJStroud/classnames-php
 *
 * @licence    MIT
 * @author     Chris Stroud (https://github.com/CJStroud)
 * @package    wpm_blocks
 * @subpackage wpm_blocks/inc
 */

if ( ! function_exists( 'class_names' ) ) {
	/**
	 * PHP port of the JavaScript classNames utility.
	 *
	 * @return string string of classnames.
	 */
	function class_names() {
		$args    = func_get_args();
		$data    = array_reduce(
			$args,
			function ( $carry, $arg ) {
				if ( is_array( $arg ) ) {
					return array_merge( $carry, $arg );
				}
				$carry[] = $arg;
				return $carry;
			},
			array()
		);
		$classes = array_map(
			function ( $key, $value ) {
				$condition = $value;
				$return    = $key;
				if ( is_int( $key ) ) {
					$condition = null;
					$return    = $value;
				}
				$is_array             = is_array( $return );
				$is_object            = is_object( $return );
				$is_stringable_type   = ! $is_array && ! $is_object;
				$is_stringable_object = $is_object && method_exists( $return, '__toString' );
				if ( ! $is_stringable_type && ! $is_stringable_object ) {
					return null;
				}
				if ( $condition === null ) {
					return $return;
				}
				return $condition ? $return : null;
			},
			array_keys( $data ),
			array_values( $data )
		);
		$classes = array_filter( $classes );
		return implode( ' ', $classes );
	}
}
