/**
 * BLOCK: person-block
 * TIER: FREE
 *
 * Registering a person block with Gutenberg.
 */

/**
 * External Dependencies
 */
import { isEmpty, pick, map } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';

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
	BlockAlignmentToolbar,
	BlockControls,
	ContrastChecker,
	getColorClassName,
	InnerBlocks,
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl,
	Toolbar,
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
	heading: {
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
	headingLevel: {
		type: 'number',
		default: 4,
	},
	blockLayout: {
		type: 'string',
		default: 'left',
	},
	imgLayout: {
		type: 'string',
		default: 'circle',
	},
	imgBorderRadius: {
		type: 'number',
		default: 10,
	},
	imgWidth: {
		type: 'number',
		default: 100,
	},
	imgAlign: {
		type: 'string',
		default: 'center',
	},
};

const allowedBlockAligmnents =  [ 'wide', 'full' ];
const borderRadiusSteps = [0,3,5,8,10,15,20,25,50,75];

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
registerBlockType( 'wpm/person', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Person', 'wp-munich-blocks' ), // Block title.
	description: __( 'A beautiful block to present your team members or other kind of people.', 'wp-munich-blocks' ),

	icon: {
			src: icons.person,
			background: '#003450',
			foreground: '#fff'
	},

	category: 'wpmunich', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wpmunich', 'wp-munich-blocks'  ),
		__( 'person', 'wp-munich-blocks'  ),
	],

	attributes: blockAttributes,

	getEditWrapperProps( attributes ) {
		const { alignment } = attributes;
		if ( 'wide' === alignment || 'full' === alignment ) {
			return { 'data-align': alignment };
		}
	},

	// The "edit" property must be a valid function.
	edit: compose( [
		withColors( 'backgroundColor', { 'textColor': 'color' } ),
	] ) (
		( {
			attributes,
			setAttributes,
			isSelected,
			className,
			backgroundColor,
			textColor,
			setBackgroundColor,
			setTextColor,
		} ) => {

		const {
			url,
			alt,
			id,
			heading,
			alignment,
			isOpen,
			headingLevel,
			blockLayout,
			imgLayout,
			imgBorderRadius,
			imgWidth,
			imgAlign,
		} = attributes;

		// on{Event} functions
		const onSelectImage          = ( media ) => setAttributes( pick( media, [ 'alt', 'id', 'url' ] ) );
		const onResetImage           = ( media ) => setAttributes( { alt: null, id: null, url: null } );
		const onChangeImageLayout    = ( newLayout ) => { setAttributes( { imgLayout: newLayout } ) };
		const onChangeBlockAlignment = ( newAlignment ) => setAttributes( { alignment: newAlignment } );
		const onChangeBorderRadius   = ( newRadius ) => {
			let newBorderRadius = borderRadiusSteps.reduce( ( prevStep, currStep) => {
				return ( Math.abs( currStep - newRadius ) < Math.abs(  prevStep - newRadius ) ? currStep : prevStep );
			});

			setAttributes( { imgBorderRadius: newBorderRadius } );
		};

		// .map callback to populate the block layout toolbar
		const createLayoutControl = ( layout ) => {
			return {
				icon: icons.blockLayoutImg[ layout ],
				title: __( `Block-Layout: image ${ layout }`, 'wp-munich-blocks' ),
				isActive: blockLayout === layout,
				onClick: () => setAttributes( { blockLayout: layout } ),
			};
		};
		const createImgPosControl = ( align ) => {
			return {
				icon: icons.imageAlign[ align ],
				title: __( `Align image ${ align }`, 'wp-munich-blocks' ),
				isActive: imgAlign === align,
				onClick: () => setAttributes( { imgAlign: align } ),
			};
		};
		const createBorderRadiusOptions = ( step ) => {
			return (
				<option value={ step } />
			);
		}

		// control constants and checks
		const hasImage = ! isEmpty( url );

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

		let imgDisplay = imagePlaceholder;
		if ( hasImage ) {
			let imgWrapperClassName = classnames( 'wpm-person-img-wrapper', {
				[`image-layout-${ imgLayout }`] : imgLayout,
				[`image-align-${ imgAlign }`] : 'top' === blockLayout ? imgAlign : undefined,
			});
			let imgClassName = classnames( "wpm-person-img", {
				[`wp-image-${ id }`] : id,
				[`has-border-radius-${ imgBorderRadius }` ] : 0 === imgBorderRadius ? undefined : imgBorderRadius,
			});

			let imgWrapperStyles = null;
			if ( 'top' === blockLayout ) {
				imgWrapperStyles = {
					width: imgWidth + '%',
				};
			}

			const imgTag = (
				<img
					className={ imgClassName }
					src={ url }
					alt={ alt }
				/>
			);

			/*
			 * two wrappers needed to work with complex
			 * forms like hexagons
			 */
			imgDisplay = (
				<div className={ imgWrapperClassName } style={ imgWrapperStyles }>
					<div className={ 'wrapper-inner' }>
						<div className={ 'wrapper-inner-2' }>
							{ imgTag }
						</div>
					</div>
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
			</BlockControls>,
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Layout', 'wp-munich-blocks' ) }>
					<PanelRow>
						<p>{ __( 'Block Layout', 'wp-munich-blocks' ) }</p>
						<Toolbar controls={ [ 'top', 'left', 'right' ].map( createLayoutControl ) } />
					</PanelRow>
					{ 'top' === blockLayout &&
						<div>
							<RangeControl
								label={ __( 'Image width (in %)', 'wp-munich-blocks') }
								value={ parseInt( imgWidth ) }
								onChange={ ( newImgWidth ) => setAttributes( { imgWidth: newImgWidth } ) }
								min={ 10 }
								max={ 100 }
							/>
							<PanelRow>
								<p>{ __( 'Image alignment', 'wp-munich-blocks' ) }</p>
								<Toolbar controls={ [ 'left', 'center', 'right' ].map( createImgPosControl ) } />
							</PanelRow>
						</div>
					}
					<SelectControl
						label={ __( 'Image Layout', 'wp-munich-blocks' ) }
						value={ imgLayout }
						options={ [
							{ label: __( 'Circle', 'wp-munich-blocks' ), value: 'circle' },
							{ label: __( 'Rectangle', 'wp-munich-blocks' ), value: 'rectangle' },
							{ label: __( 'Hexagon', 'wp-munich-blocks' ), value: 'hexagon' },
						] }
						onChange={ onChangeImageLayout }
					/>
					{ 'rectangle' === imgLayout &&
						<RangeControl
							label={ __( 'Border Radius (in px)', 'wp-munich-blocks') }
							value={ parseInt( imgBorderRadius ) }
							onChange={ onChangeBorderRadius }
							min={ 0 }
							max={ borderRadiusSteps[ borderRadiusSteps.length - 1 ] }
						/>
					}
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
			</InspectorControls>
		];

		// prepare classnames and styles for block and blockelements.
		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const blockClassNames = classnames( className, {
			[`align${ alignment }`]: alignment,
			[ textColor.class ]: textColor.class,
			[ backgroundColor.class ]: backgroundColor.class,
			[`is-block-layout-img-${ blockLayout }`]: blockLayout,
		} );

		const blockStyles = {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
		};

		const contentTemplate = [
			['core/heading', {
				placeholder: __( 'Name...', 'wp-munich-blocks' ),
				level: headingLevel ,
				onChange: ( newHeadingLevel ) => setAttributes( { headingLevel: newHeadingLevel } )
			} ],
			['core/paragraph', { placeholder: __( 'Job designation...', 'wp-munich-blocks' ) } ],
			['core/paragraph', { placeholder: __( 'Enter content...', 'wp-munich-blocks' ) } ],
		];

		const allowedBlocks = [];

		// Creates the editor output
		return [
			controls,
			<div className={ blockClassNames } style={ blockStyles }>
				{ imgDisplay }
				<div class="wpm-person-contents">
					<div className={ 'entry-content' }>
						<InnerBlocks allowedBlocks={ allowedBlocks } template={ contentTemplate } templateLock={ 'all' } />
					</div>
				</div>
			</div>
		];
	}),

	// The "save" property must be specified and must be a valid function.
	save: ( { attributes, className } ) => {

		const {
			url,
			alt,
			id,
			heading,
			alignment,
			isOpen,
			headingLevel,
			blockLayout,
			imgLayout,
			imgBorderRadius,
			backgroundColor,
			textColor,
			customBackgroundColor,
			customTextColor,
			imgWidth,
			imgAlign,
		} = attributes;

		const hasImage = ! isEmpty( url );

		let imgDisplay = null;
		if ( hasImage ) {
			let imgWrapperClassName = classnames( 'wpm-person-img-wrapper', {
				[`image-layout-${ imgLayout }`] : imgLayout,
				[`image-align-${ imgAlign }`] : 'top' === blockLayout ? imgAlign : undefined,
			});
			let imgClassName = classnames( "wpm-person-img", {
				[`wp-image-${ id }`] : id,
				[`has-border-radius-${ imgBorderRadius }` ] : 0 === imgBorderRadius ? undefined : imgBorderRadius,
			});

			let imgWrapperStyles = null;
			if ( 'top' === blockLayout ) {
				imgWrapperStyles = {
					width: imgWidth + '%',
				};
			}

			const imgTag = (
				<img
					className={ imgClassName }
					src={ url }
					alt={ alt }
				/>
			);

			/*
			 * two wrappers needed to work with complex
			 * forms like hexagons
			 */
			imgDisplay = (
				<div className={ imgWrapperClassName } style={ imgWrapperStyles }>
					<div className={ 'wrapper-inner' }>
						<div className={ 'wrapper-inner-2' }>
							{ imgTag }
						</div>
					</div>
				</div>
			);
		}

		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const blockClassNames = classnames( className, {
			[`align${ alignment }`]: alignment,
			[ textClass ]: textClass,
			[ backgroundClass ]: backgroundClass,
			[`is-block-layout-img-${ blockLayout }`]: blockLayout,
		} );

		const blockStyles = {
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			color: textClass ? undefined : customTextColor,
		};

		return (
			<div className={ blockClassNames } style={ blockStyles }>
				{ imgDisplay }
				<div class="wpm-person-contents">
					<div className={ 'entry-content' }>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
} );

/** Helper Functions **/
