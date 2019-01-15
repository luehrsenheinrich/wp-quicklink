/**
 * BLOCK: background-block
 * TIER: FREE
 *
 * Registering a basic test block with Gutenberg.
 */

/**
 * External Dependencies
 */
import { isEmpty, get, pick, map, startCase } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';
import { getAvailableSizes, getLargestAvailableSize } from '../common/common';
import DirectionControl from '../common/direction-control';

import { save_deprecated_20181213 } from './deprecations';

/**
 * WordPress dependencies
 */
const { registerBlockType } = wp.blocks;
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
	BaseControl
} = wp.components;

const { Fragment } = wp.element;

const blockAttributes = {
	url: {
		type: 'string',
	},
	id: {
		type: 'number',
	},
	alt: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	backgroundColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	alignment: {
		type: 'string',
	},
	minHeight: {
		type: 'string',
	},
	opacity: {
		type: 'number',
		default: 100,
	},
	imagePosition: {
		type: 'string',
		default: 'center-center',
	},
	hasParallax: {
		type: 'bool',
		default: false,
	}
};

const allowedBlockAligmnents =  [ 'wide', 'full' ];


/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'wpm/background', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Background', 'wp-munich-blocks' ), // Block title.
	description: __( 'A block to style the background behind a number of other blocks.', 'wp-munich-blocks' ),

	icon: {
			src: icons.background,
			background: '#003450',
			foreground: '#fff'
	},

	category: 'wpmunich', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wpmunich', 'wp-munich-blocks'  ),
		__( 'background', 'wp-munich-blocks'  ),
	],

	attributes: blockAttributes,

	getEditWrapperProps( attributes ) {
		const { alignment } = attributes;
		if ( 'wide' === alignment || 'full' === alignment ) {
			return { 'data-align': alignment };
		}
	},

	deprecated: [
		{
			attributes: blockAttributes,
			save: save_deprecated_20181213,
		}
	],

	// The "edit" property must be a valid function.
	edit: compose( [
		withColors( 'backgroundColor', { 'textColor': 'color' } ),
		withSelect( ( select, props ) => {
			const { getMedia } = select( 'core' );
			const { id, centerId } = props.attributes;

			return {
				image: id ? getMedia( id ) : null,
			}

		} ),
	] ) ( ( { attributes, setAttributes, isSelected, className, backgroundColor, textColor, setBackgroundColor, setTextColor, image, centerImage } ) => {

		const {
				url,
				id,
				alt,
				alignment,
				minHeight,
				opacity,
				imagePosition,
				hasParallax,
		} = attributes;

		const hasImage = ! isEmpty( url );
		const onChangeBlockAlignment = ( newAlignment ) => setAttributes( { alignment: newAlignment } );

		// The background image
		const onSelectImage = ( image ) => {
			// Get the largest available size equal or smaller than large
			const imageSize = getLargestAvailableSize( image );

			if( ! imageSize ) {
				return false;
			}

			setAttributes(
				{
					alt: image.alt,
					id: image.id,
					url: imageSize.url,
				}
			);
		}
		const onResetImage = ( media ) => setAttributes( { alt: null, id: null, url: null } );

		// Create the needed controls
		const controls = isSelected && [
			<BlockControls key="controls">
				<BlockAlignmentToolbar
						value={ alignment }
						onChange={ onChangeBlockAlignment }
						controls={ allowedBlockAligmnents }
					/>
			</BlockControls>,
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Layout', 'wp-munich-blocks' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Minimum Height', 'wp-munich-blocks' ) }
						value={ minHeight }
						onChange={ (newValue) => setAttributes( {minHeight: newValue} ) }
					/>
					<ToggleControl
						label={ __( 'Fixed Background', 'wp-munich-blocks' ) }
						checked={ hasParallax }
						onChange={ (value) => { setAttributes( { hasParallax: !hasParallax } ) } }
					/>
				</PanelBody>
				<PanelColorSettings
							title={ __('Color', 'wp-munich-blocks') }
							initialOpen={ false }
							colorSettings={ [
									{
										value: backgroundColor.color,
										onChange: setBackgroundColor,
										label: __('Background Color', 'wp-munich-blocks')
									},
									{
										value: textColor.color,
										onChange: setTextColor,
										label: __('Text Color', 'wp-munich-blocks')
									},
								]
							}
				>
				<ContrastChecker
					{ ...{
						isLargeText: false,
						textColor: textColor.color,
						backgroundColor: backgroundColor.color,
					} }
				/>
				</PanelColorSettings>
				<PanelBody title={ __( 'Image', 'wp-munich-blocks' ) } initialOpen={ false }>
					<BaseControl>
						<ButtonGroup>
							<MediaUpload
								onSelect={ onSelectImage }
								type="image"
								value={ id }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										isSmall
										isPrimary={ hasImage }
									>
									{ hasImage ? __( 'Edit', 'wp-munich-blocks' ) : __( 'Add', 'wp-munich-blocks' )  }
									</Button>
								) }
							/>

							<Button
								isSmall
								onClick={ onResetImage }
							>
							{ __( 'Reset', 'wp-munich-blocks' ) }
							</Button>
						</ButtonGroup>
					</BaseControl>
					{ ! isEmpty( getAvailableSizes( image ) ) && (
						<SelectControl
							label={ __( 'Size', 'wp-munich-blocks' ) }
							options={ map( getAvailableSizes( image ), ( size, name ) => ( {
								value: size.source_url,
								label: startCase( name ),
							} ) ) }
							value={ url }
							onChange={ (value) => { setAttributes({ url: value}); } }
						/>
					) }
					{ hasImage && (
						<Fragment>
							<RangeControl
								label={ __( 'Opcaity', 'wp-munich-blocks' ) }
								value={ opacity }
								onChange={ (value) => { setAttributes( { opacity: value} ) } }
								min={ 10 }
								max={ 100 }
								step={ 10 }
							/>
							<DirectionControl
								onChange={ ( value ) => { setAttributes( { imagePosition: value } ) }  }
								selected={ imagePosition }
								label={ __( 'Position', 'wp-munich-blocks' ) }
							/>
						</Fragment>
					) }
				</PanelBody>
			</InspectorControls>
		];


		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const blockClassNames = classnames( className, {
			[ `align${ alignment }` ]: alignment,
			[ `align${ alignment }-padding` ]: alignment,
			[ 'has-background-image' ]: hasImage,
			[ 'has-parallax' ]: hasParallax,
			[ textColor.class ]: textColor.class,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const blockStyles = {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
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
		return [
			controls,
			<div className={ blockClassNames } style={ blockStyles }>
				{ hasImage && (
					<div className={ backgroundImageClassNames } style={ backgroundImageStyles }></div>
				) }
				<div className={ 'entry-content' }>
					<InnerBlocks />
				</div>
			</div>
		];
	}),

	// The "save" property must be specified and must be a valid function.
	save: function( { attributes, setAttributes, isSelected, className } ) {
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
				<div className={ 'entry-content' }>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
