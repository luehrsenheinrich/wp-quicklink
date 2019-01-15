/**
 * BLOCK: split-block
 * TIER: FREE
 *
 * Registering a basic test block with Gutenberg.
 */

/**
 * External Dependencies
 */
import { isEmpty, pick, get, startCase, map } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';
import DirectionControl from '../common/direction-control';

import { save_deprecation_20181212 } from './deprecations';

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
	centerUrl: {
		type: 'string',
	},
	centerId: {
		type: 'number',
	},
	centerAlt: {
		type: 'string',
	},
	splitAlign: {
		type: 'string',
		default: 'left',
	},
	mobileSplitAlign: {
		type: 'string',
		default: 'top',
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
	centerImageDirection: {
		type: 'string',
		default: 'center-center',
	},
	minHeight: {
		type: 'string',
	},
	hasParallax: {
		type: 'bool',
		default: false,
	}
};

const allowedBlockAligmnents =  [ 'wide', 'full' ];

/**
 * Register: a Gutenberg Block. test
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
registerBlockType( 'wpm/split', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Split', 'wp-munich-blocks' ), // Block title.
	description: __( 'A block to show an image on one side and text on the other side.', 'wp-munich-blocks' ),

	icon: {
			src: icons.split,
			background: '#003450',
			foreground: '#fff'
	},

	category: 'wpmunich', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wpmunich', 'wp-munich-blocks'  ),
		__( 'split', 'wp-munich-blocks'  ),
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
			save: ( { attributes, setAttributes, isSelected, className } ) => {
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
				} = attributes;

				const hasImage = ! isEmpty( url );
				const hasCenterImage = ! isEmpty( centerUrl );

				// The center image component
				let centerImgDisplay = null;
				if( hasCenterImage && hasImage ) {

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

					imgDisplay = imgTag;
				}

				const textClass = getColorClassName( 'color', textColor );
				const backgroundClass = getColorClassName( 'background-color', backgroundColor );

				const blockClassNames = classnames( className, {
					[`is-split-${ splitAlign }`]: splitAlign,
					[`align${ alignment }`]: alignment,
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
			},
		},
		{
			attributes: blockAttributes,
			save: ( { attributes, setAttributes, isSelected, className } ) => {

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
					minHeight
				} = attributes;

				const hasImage = ! isEmpty( url );
				const hasCenterImage = ! isEmpty( centerUrl );

				// The center image component
				let centerImgDisplay = null;
				if( hasCenterImage && hasImage ) {

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
			},
		}
	],

	transforms: {
	},

	// The "edit" property must be a valid function.
	edit: compose( [
		withColors( 'backgroundColor', { 'textColor': 'color' } ),
		withSelect( ( select, props ) => {
			const { getMedia } = select( 'core' );
			const { id, centerId } = props.attributes;

			return {
				image: id ? getMedia( id ) : null,
				centerImage: centerId ? getMedia( centerId ) : null,
			}

		} ),
	] ) ( ( { attributes, setAttributes, isSelected, className, setState, backgroundColor, textColor, setBackgroundColor, setTextColor, image, centerImage } ) => {

		const {
				url,
				id,
				alt,
				centerUrl,
				centerId,
				centerAlt,
				splitAlign,
				alignment,
				centerImageDirection,
				minHeight,
				mobileSplitAlign,
				hasParallax,
		} = attributes;

		const hasImage = ! isEmpty( url );
		const hasCenterImage = ! isEmpty( centerUrl );

		const onChangeAlignment = ( newAlignment ) => setAttributes( { splitAlign: newAlignment } );
		const onChangeMobileAlignment = ( newAlignment ) => setAttributes( { mobileSplitAlign: newAlignment } );
		const onChangeBlockAlignment = ( newAlignment ) => setAttributes( { alignment: newAlignment } );

		// The background image
		const onSelectImage = ( media ) => setAttributes( pick( media, [ 'alt', 'id', 'url' ] ) );
		const onResetImage = ( media ) => setAttributes( { alt: null, id: null, url: null } );

		// The center image
		const onSelectCenterImage = ( media ) => setAttributes( { centerAlt: media.alt, centerId: media.id, centerUrl: media.url } );
		const onResetCenterImage = ( media ) => setAttributes( { centerAlt: null, centerId: null, centerUrl: null } );

		const imagePlaceholder = (
			<MediaPlaceholder
				key="image-placeholder"
				icon="format-image"
				labels={ {
					title: __( 'Image', 'wp-munich-blocks' ),
					name: __( 'image', 'wp-munich-blocks' )
				} }
				onSelect={ onSelectImage }
				accept="image/*"
				allowedTypes={ ['image'] }
			/>
		);

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
		let imgDisplay = hasCenterImage ? null : imagePlaceholder;
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

		// Create the needed controls
		const controls = isSelected && [
			<BlockControls key="controls">
				<BlockAlignmentToolbar
						value={ alignment }
						onChange={ onChangeBlockAlignment }
						controls={ allowedBlockAligmnents }
					/>
				<Toolbar>
					<IconButton
						className={ classnames( 'components-toolbar__control', {
								'is-active': ( splitAlign === 'left' ),
							} ) }
						label={ __( 'Left', 'wp-munich-blocks' ) }
						icon="arrow-left"
						onClick={ () => { onChangeAlignment('left') } }
					/>
					<IconButton
						className={ classnames( 'components-toolbar__control', {
								'is-active': ( splitAlign === 'right' ),
							} ) }
						label={ __( 'Right', 'wp-munich-blocks' ) }
						icon="arrow-right"
						onClick={ () => { onChangeAlignment('right') } }
					/>
				</Toolbar>
				<Toolbar>
					<MediaUpload
						onSelect={ onSelectImage }
						allowedTypes={ ['image'] }
						value={ id }
						render={ ( { open } ) => (
							<IconButton
								className="components-toolbar__control"
								label={ __( 'Edit image', 'wp-munich-blocks' ) }
								icon="edit"
								onClick={ open }
							/>
						) }
					/>
				</Toolbar>
			</BlockControls>,
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Layout', 'wp-munich-blocks' ) } initialOpen={ false }>

					<TextControl
						label={ __( 'Minimum Height', 'wp-munich-blocks' ) }
						value={ minHeight }
						onChange={ (newValue) => setAttributes( {minHeight: newValue} ) }
					/>

					<BaseControl label={ __( 'Image Alignment', 'wp-munich-blocks' ) } >
						<ButtonGroup>
							<Tooltip text={ __( 'Left', 'wp-munich-blocks' ) }>
								<Button
									isSmall
									isPrimary={ splitAlign === 'left' }
									onClick={ () => { onChangeAlignment('left') } }
								>
									<Icon icon="arrow-left" />
								</Button>
							</Tooltip>
							<Tooltip text={ __( 'Right', 'wp-munich-blocks' ) }>
								<Button
									isSmall
									isPrimary={ splitAlign === 'right' }
									onClick={ () => { onChangeAlignment('right') } }
								>
									<Icon icon="arrow-right" />
								</Button>
							</Tooltip>
						</ButtonGroup>
					</BaseControl>

					<BaseControl label={ __( 'Mobile Image Alignment', 'wp-munich-blocks' ) } >
						<ButtonGroup>
							<Tooltip text={ __( 'Top', 'wp-munich-blocks' ) }>
								<Button
									isSmall
									isPrimary={ mobileSplitAlign === 'top' }
									onClick={ () => { onChangeMobileAlignment('top') } }
								>
									<Icon icon="arrow-up" />
								</Button>
							</Tooltip>
							<Tooltip text={ __( 'Bottom', 'wp-munich-blocks' ) }>
								<Button
									isSmall
									isPrimary={ mobileSplitAlign === 'bottom' }
									onClick={ () => { onChangeMobileAlignment('bottom') } }
								>
									<Icon icon="arrow-down" />
								</Button>
							</Tooltip>
						</ButtonGroup>
					</BaseControl>


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
				<PanelBody title={ __( 'Background Image', 'wp-munich-blocks' ) } initialOpen={ false }>
					<BaseControl>
						<ButtonGroup>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ ['image'] }
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
							label={ __( 'Image Size', 'wp-munich-blocks' ) }
							options={ map( getAvailableSizes( image ), ( size, name ) => ( {
								value: size.source_url,
								label: startCase( name ),
							} ) ) }
							value={ url }
							onChange={ (value) => { setAttributes({ url: value}); } }
						/>
					) }
				</PanelBody>
				<PanelBody title={ __( 'Center Image', 'wp-munich-blocks' ) } initialOpen={ false }>
					<BaseControl>
						<ButtonGroup>
							<MediaUpload
								onSelect={ onSelectCenterImage }
								allowedTypes={ ['image'] }
								value={ centerId }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										isSmall
										isPrimary={ hasCenterImage }
									>
									{ hasCenterImage ? __( 'Edit', 'wp-munich-blocks' ) : __( 'Add', 'wp-munich-blocks' )  }
									</Button>
								) }
							/>

							<Button
								isSmall
								onClick={ onResetCenterImage }
							>
							{ __( 'Reset', 'wp-munich-blocks' ) }
							</Button>
						</ButtonGroup>
					</BaseControl>
					{ hasCenterImage && (
						<DirectionControl
							onChange={ ( value ) => { setAttributes( { centerImageDirection: value } ) }  }
							selected={ centerImageDirection }
							label={ __( 'Image Position', 'wp-munich-blocks' ) }
						/>
					) }
					{ ! isEmpty( getAvailableSizes( centerImage ) ) && (
						<SelectControl
							label={ __( 'Image Size', 'wp-munich-blocks' ) }
							options={ map( getAvailableSizes( centerImage ), ( size, name ) => ( {
								value: size.source_url,
								label: startCase( name ),
							} ) ) }
							value={ centerUrl }
							onChange={ (value) => { setAttributes({ centerUrl: value}); } }
						/>
					) }
					</PanelBody>
			</InspectorControls>
		];


		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const blockClassNames = classnames( className, {
			[`is-split-${ splitAlign }`]: splitAlign,
			[`is-mobile-split-${ mobileSplitAlign }`]: mobileSplitAlign,
			[`align${ alignment }`]: alignment,
			[ 'has-parallax' ]: hasParallax,
			[ textColor.class ]: textColor.class,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const blockStyles = {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
			minHeight: minHeight ? minHeight : undefined,
		};

		const allowedBlocks = [
			'core/paragraph',
			'core/heading',
			'core/button',
			'core/spacer',
		];


		// Creates the editor output
		return [
			controls,
			<div className={ blockClassNames } style={ blockStyles }>
				{ imgDisplay }
				{ centerImgDisplay }
				<div className={ 'split-content-body' }>
					<div className={ 'entry-content' }>
						<InnerBlocks allowedBlocks={ allowedBlocks } />
					</div>
				</div>
			</div>
		];
	}),

	// The "save" property must be specified and must be a valid function.
	save: ( { attributes, setAttributes, isSelected, className } ) => {

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
			[ `is-split-${ splitAlign }` ]: splitAlign,
			[ `align${ alignment }` ]: alignment,
			[ `is-mobile-split-${ mobileSplitAlign }` ]: mobileSplitAlign,
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
					<div className={ 'entry-content' }>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
} );

/**
 * HELPER FUNCTIONS
 */

const getAvailableSizes = ( image ) => {
	return get( image, [ 'media_details', 'sizes' ], {} );
}
