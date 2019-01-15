/**
 * BLOCK: accordion-block
 * TIER: FREE
 *
 * Registering a accordion block with Gutenberg.
 */

/**
 * External Dependencies
 */
import { isEmpty, pick, get, startCase, map } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';
import HeadingToolbar from '../common/heading-toolbar';

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
	BlockControls,
	InspectorControls,
	ColorPalette,
	ContrastChecker,
	BlockAlignmentToolbar,
	getColorClassName,
	withColors,
	PanelColorSettings,
	RichText,
} = wp.editor;

const {
	PanelBody,
	ToggleControl,
	Toolbar,
} = wp.components;


const blockAttributes = {
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
		default: '#f3f4f5',
	},
	alignment: {
		type: 'string',
	},
	isOpen: {
		type: 'boolean',
		default: false,
	},
	headingLevel: {
		type: 'number',
		default: 3,
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
registerBlockType( 'wpm/accordion', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Accordion', 'wp-munich-blocks' ), // Block title.
	description: __( 'Add content as an expandable accordion.', 'wp-munich-blocks' ),

	icon: {
			src: icons.accordion,
			background: '#003450',
			foreground: '#fff'
	},

	category: 'wpmunich', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wpmunich', 'wp-munich-blocks'  ),
		__( 'accordion', 'wp-munich-blocks'  ),
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
			heading,
			alignment,
			isOpen,
			headingLevel,
		} = attributes;

		const onChangeBlockAlignment = ( newAlignment ) => setAttributes( { alignment: newAlignment } );
		const onChangeHeadingLevel   = ( newLevel ) => setAttributes( { headingLevel: newLevel } );
		const onToggleIsOpen         = () => setAttributes( { isOpen: ! isOpen } );

		const headingTagName = headingLevel == 7 ? 'p' : 'h' + headingLevel;
		const headingLevelMin = 2;
		const headingLevelMax = 7; // 7 flags the tag to be a "p".

		// Create the needed controls
		const controls = isSelected && [
			<BlockControls key="controls">
				<BlockAlignmentToolbar
					value={ alignment }
					onChange={ onChangeBlockAlignment }
					controls={ allowedBlockAligmnents }
				/>
				<HeadingToolbar
					minLevel={ headingLevelMin }
					maxLevel={ headingLevelMax }
					selectedLevel={ headingLevel }
					onChange={ onChangeHeadingLevel }
				/>
			</BlockControls>,
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Layout', 'wp-munich-blocks' ) }>
					<ToggleControl
						label={ __( 'Open on init', 'wp-munich-blocks') }
						help={ isOpen ? __( 'Accordion is opened by default.', 'wp-munich-blocks' ) : __( 'Accordion is closed by default.', 'wp-munich-blocks' ) }
						checked={ isOpen }
						onChange={ onToggleIsOpen }
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
			</InspectorControls>
		];


		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const blockClassNames = classnames( className, {
			[`align${ alignment }`]: alignment,
			[ textColor.class ]: textColor.class,
			[ backgroundColor.class ]: backgroundColor.class,
			[`is-open`]: isOpen,
		} );

		const blockStyles = {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
		};

		const contentTemplate = [
			['core/paragraph', { placeholder: __( 'Enter accordion content...', 'wp-munich-blocks' ) } ],
		];

		const allowedBlocks = [
			'core/paragraph',
			'core/heading',
			'core/button',
			'core/spacer',
			'core/list',
			'core/gallery',
			'core/separator',
			'core/embed',
		];

		// Creates the editor output
		return [
			controls,
			<div className={ blockClassNames } style={ blockStyles }>
				<div className={ 'accordion-header' }>
					<RichText
						tagName={ headingTagName }
						className={ 'accordion-title' }
						value={ heading }
						onChange={ ( heading ) => setAttributes( { heading } ) }
						placeholder={ __( 'Accordion heading...', 'wp-munich-blocks' ) }
						multiline={ false }
						keepPlaceholderOnFocus={ true }
					/>
					<span className={ 'accordion-chevron' }>
						{ icons.chevron }
					</span>
				</div>
				<div className={ 'accordion-content-body' }>
					<div className={ 'entry-content' }>
						<InnerBlocks allowedBlocks={ allowedBlocks } template={ contentTemplate } />
					</div>
				</div>
			</div>
		];
	}),

	// The "save" property must be specified and must be a valid function.
	save: ( { attributes, className } ) => {

		const {
			heading,
			alignment,
			backgroundColor,
			textColor,
			customBackgroundColor,
			customTextColor,
			isOpen,
			headingLevel,
		} = attributes;

		const headingTagName = headingLevel == 7 ? 'p' : 'h' + headingLevel;

		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const blockClassNames = classnames( className, {
			[`align${ alignment }`]: alignment,
			[ textClass ]: textClass,
			[ backgroundClass ]: backgroundClass,
			[`is-open`]: isOpen,
		} );

		const blockStyles = {
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			color: textClass ? undefined : customTextColor,
		};

		return (
			<div className={ blockClassNames } style={ blockStyles }>
				<div className={ 'accordion-header' }>
					<RichText.Content
						tagName={ headingTagName }
						value={ heading }
						className={ 'accordion-title' }
					/>
					<span className={ 'accordion-chevron' }>
						{ icons.chevron }
					</span>
				</div>
				<div className={ 'accordion-content-body' }>
					<div className={ 'entry-content' }>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
} );
