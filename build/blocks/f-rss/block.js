/**
 * BLOCK: rss-block
 * TIER: FREE
 *
 * Registering a rss-feed block.
 */

/**
 * External Dependencies
 */
import icons from '../common/icons';
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
* WordPress dependencies
*/
const { registerBlockType } = wp.blocks;
const { compose, withState } = wp.compose;
const {
	__,
	sprintf
} = wp.i18n;
const {
	BlockControls,
	BlockIcon,
	ContrastChecker,
	getColorClassName,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;
const {
	Button,
	IconButton,
	PanelBody,
	PanelRow,
	Placeholder,
	RangeControl,
	TextControl,
	Toolbar,
	ServerSideRender,
} = wp.components;

const blockAttributes = {
	// Feed-URL
	url: {
		type:	 'string',
		default: '',
	},
	// Feed Options
	amount: {
		type:    'string',
		default: '4',
	},
	// Colors
	textColor: {
		type:	 'string',
		default: '',
	},
	customTextColor: {
		type:	 'string',
		default: '',
	},
	backgroundColor: {
		type:	 'string',
		default: '',
	},
	customBackgroundColor: {
		type:	 'string',
		default: '',
	},
	columns: {
		type:    'string',
		default: '2',
	},
}

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
 registerBlockType( 'wpm/rss', {
 	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
 	title: __( 'RSS', 'wp-munich-blocks' ), // Block title.
 	description: __( 'A block to show items of a given RSS-feed.', 'wp-munich-blocks' ),

 	icon: {
 			src: icons.rss,
			background: '#003450',
 			foreground: '#fff',
 	},

 	category: 'wpmunich', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
 	keywords: [
 		__( 'wpmunich', 'wp-munich-blocks'  ),
 		__( 'rss', 'wp-munich-blocks'  ),
 	],

 	attributes: blockAttributes,

	edit: compose( [
		withColors( 'backgroundColor', { 'textColor': 'color' } ),
		withState({
			isInit: true,
			editingURL: true,
		}),
	] ) ( (
		{
			attributes,
			setAttributes,
			isSelected,
			className,
			isInit,
			editingURL,
			setState,
			backgroundColor,
			textColor,
			setBackgroundColor,
			setTextColor
		}
	) => {
		const { url, amount, columns } = attributes;

		if ( isInit ) {
			if ( ! isEmpty( url ) ) {
				setState( { editingURL: false } );
			}

			setState( { isInit: false } );
		}

		// Create the needed controls
		const controls = isSelected && [
			<BlockControls key="controls">
				<Toolbar>
					<IconButton
						className="components-toolbar__control"
						label={ __( 'Edit URL', 'wp-munich-blocks' ) }
						icon="edit"
						onClick={ ( event ) => setState( { editingURL: true } ) }
					/>
				</Toolbar>
			</BlockControls>,
			<InspectorControls key="inspector">
				<PanelBody
					title={ __( 'RSS Feed Options', 'wp-munich-blocks' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Amount of items', 'wp-munich-blocks' ) }
						value={ amount }
						onChange={ ( value ) => { setAttributes( { amount: value } ); } }
						type="number"
						min={ 1 }
					/>
					<RangeControl
						label={ __( 'Columns', 'wp-munich-blocks' ) }
						value={ parseInt( columns ) }
						onChange={ ( value ) => setAttributes( { columns: value.toString() } ) }
						min={ 1 }
						max={ 4 }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color', 'wp-munich-blocks' ) }
					initialOpen={ false }
					colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color', 'wp-munich-blocks' )
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'wp-munich-blocks' )
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

		const blockClassNames = classnames( className, {} );

		if ( editingURL ) {
			return [
				<div className={ blockClassNames }>
					<Placeholder
						icon={ <BlockIcon icon={ icons.rss } showColors /> }
						label={ __( 'RSS Feed URL', 'wp-munich-blocks'  ) }
						className="wp-block-embed"
					>
						<form onSubmit={ (e) => {
							e.preventDefault();
							setState( { editingURL: false } );
							return false;
						} }>
							<input
								type="url"
								value={ url || '' }
								className="components-placeholder__input"
								aria-label={ __( 'Enter URL to embed here...', 'wp-munich-blocks' ) }
								placeholder={ __( 'Enter URL to embed here...', 'wp-munich-blocks' ) }
								onChange={ ( event ) => setAttributes( { url: event.target.value } ) } />
							<Button
								isLarge
								type="submit"
							>
								{ __( 'Embed' ) }
							</Button>
						</form>
					</Placeholder>
				</div>
			];
		};

		return [
			controls,
			<ServerSideRender
				block="wpm/rss"
				attributes={ {
					url: url,
					amount: amount,
					backgroundColor: backgroundColor.color,
					textColor: textColor.color,
					columns: columns,
				} }
			/>
		];
	}),

	// ServerSideRender executes index.php.
	save: function() {
		return null;
	},
} );
