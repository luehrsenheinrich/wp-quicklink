/**
 * External Dependencies
 */
import { isEmpty, pick, get, startCase, map } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';
import DirectionControl from '../common/direction-control';

/**
 * WordPress dependencies
 */
const { registerBlockType, createBlock } = wp.blocks;
const { compose } = wp.compose;
const { withSelect } = wp.data;

const {
	__,
	sprintf
} = wp.i18n;

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
	BaseControl,
	Icon,
	Tooltip,
} = wp.components;

/**
 * The save deprecation from 12.12.2018
 */
export const save_deprecation_20181212 = ( { attributes, setAttributes, isSelected, className } ) => {

	const {
		url,
		alt,
		id,
		centerUrl,
		centerId,
		centerAlt,
		splitAlign,
		alignment,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		centerImageDirection,
		minHeight,
		mobileSplitAlign,
		hasParallax,
	} = attributes;

	const hasImage = ! isEmpty( url );
	const hasCenterImage = ! isEmpty( centerUrl );

	// The center image component
	let centerImgDisplay = null;
	if( hasCenterImage ) {

		let imgClassName = classnames( "center-image", {
			[`wp-image-${ id }`] : id,
			[`is-position-${ centerImageDirection }`] : centerImageDirection,
		});

		const imgTag = (
			<img
				className={ imgClassName }
				src={ centerUrl }
				alt={ centerAlt }
			/>
		);

		centerImgDisplay = imgTag;
	}

	// The split image component
	let imgDisplay = null;
	if( hasImage ) {

		let imgClassName = classnames( "split-image", {
			[`wp-image-${ id }`] : id
		});

		const imgTag = (
			<img
				className={ imgClassName }
				src={ url }
				alt={ alt }
			/>
		);

		imgDisplay = (
			<div className={ 'split-image-wrapper' }>
				{ imgTag }
			</div>
		);
	}

	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName( 'background-color', backgroundColor );

	const blockClassNames = classnames( className, {
		[`is-split-${ splitAlign }`]: splitAlign,
		[`align${ alignment }`]: alignment,
		[`is-mobile-split-${ mobileSplitAlign }`]: mobileSplitAlign,
		[ 'has-parallax' ]: hasParallax,
		[ textClass ]: textClass,
		[ backgroundClass ]: backgroundClass,
	} );

	const blockStyles = {
		backgroundColor: backgroundClass ? undefined : customBackgroundColor,
		color: textClass ? undefined : customTextColor,
		minHeight: minHeight ? minHeight : undefined,
	};

	return (
		<div className={ blockClassNames } style={ blockStyles }>
			{ imgDisplay }
			{ centerImgDisplay }
			<div className={ 'split-content-body' }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};
