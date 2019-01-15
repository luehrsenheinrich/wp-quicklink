/**
 * Heading Toolbar component.
 *
 * @see: https://github.com/WordPress/gutenberg/blob/bad6c5a707f904ba3012b886bdf815d97ad269ce/packages/block-library/src/heading/heading-toolbar.js
 */

/**
 * External dependencies
 */
import { range } from 'lodash';
import icons from '../common/icons';

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Component } = wp.element;
const { Toolbar } = wp.components;

class HeadingToolbar extends Component {
	createLevelControl( targetLevel, selectedLevel, onChange ) {
		/*
		 * Since no "H7" exists we use it as a switch to
		 * enable paragraph support.
		 *
		 * Maybe change it to "switch-case" on a later
		 * state to add support for other tags.
		 */
		if ( targetLevel == 7 ) {
			return {
				icon: icons.paragraph,
				title: __( 'Paragraph', 'wp-munich-blocks' ),
				isActive: targetLevel === selectedLevel,
				onClick: () => onChange( targetLevel ),
			};
		} else {
			return {
				icon: 'heading',
				// translators: %s: heading level e.g: "1", "2", "3"
				title: sprintf( __( 'Heading %d', 'wp-munich-blocks' ), targetLevel ),
				isActive: targetLevel === selectedLevel,
				onClick: () => onChange( targetLevel ),
				subscript: String( targetLevel ),
			};
		}
	}

	render() {
		const { minLevel, maxLevel, selectedLevel, onChange } = this.props;

		return (
			<Toolbar controls={ range( minLevel, maxLevel + 1 ).map( ( index ) => this.createLevelControl( index, selectedLevel, onChange ) ) } />
		);
	}
}

export default HeadingToolbar;
