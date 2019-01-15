/**
 * External Dependencies
 */
import { isEmpty, get, pick, map, startCase } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';
import { getAvailableSizes, getLargestAvailableSize } from '../common/common';
import DirectionControl from '../common/direction-control';

/**
 * WordPress dependencies
 */
const { registerBlockType } = wp.blocks;
const { compose } = wp.compose;
const { withSelect } = wp.data;

const {
	InnerBlocks,
	MediaUpload,
	MediaPlaceholder,
	BlockControls,
	InspectorControls,
	ColorPalette,
	ContrastChecker,
	BlockAlignmentToolbar,
	getColorClassName,
	withColors,
	PanelColorSettings,
} = wp.editor;

const {
	Button,
	ButtonGroup,
	IconButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	Toolbar,
	SelectControl,
	BaseControl
} = wp.components;

const { Fragment } = wp.element;

const {
	__,
	sprintf
} = wp.i18n;

export const save_deprecated_20181213 = function( { attributes, setAttributes, isSelected, className } ) {
	const {
		url,
		id,
		alt,
		alignment,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		minHeight,
		opacity,
		imagePosition,
		hasParallax
	} = attributes;

	const hasImage = ! isEmpty( url );

	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );

	const blockClassNames = classnames( className, {
		[ `align${ alignment }` ]: alignment,
		[ `align${ alignment }-padding` ]: alignment,
		[ 'has-background-image' ]: hasImage,
		[ 'has-parallax' ]: hasParallax,
		[ textClass ]: textClass,
		[ backgroundClass ]: backgroundClass,
	} );

	const blockStyles = {
		backgroundColor: backgroundClass ? undefined : customBackgroundColor,
		color: textClass ? undefined : customTextColor,
		minHeight: minHeight ? minHeight : undefined,
	};

	const backgroundImageClassNames = classnames( 'background-image', {
		[ `has-opacity-${ opacity }` ]: ( opacity < 100 ) ? opacity : undefined,
		[ `has-position-${ imagePosition }` ]: imagePosition,
	});

	const backgroundImageStyles = {
		backgroundImage: 'url(' + url + ')',
	}

	// Creates the editor output
	return (
		<div className={ blockClassNames } style={ blockStyles }>
			{ hasImage && (
				<div className={ backgroundImageClassNames } style={ backgroundImageStyles }></div>
			) }
			<div class="agncy-background-body">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};
