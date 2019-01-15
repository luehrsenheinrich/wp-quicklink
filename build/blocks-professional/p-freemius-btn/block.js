/**
 * BLOCK: freemius-btn-block
 * TIER: FREE
 *
 * Registering the freemius button block with Gutenberg.
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

const {
	__,
	sprintf
} = wp.i18n;

const {
	InnerBlocks,
	BlockControls,
	InspectorControls,
} = wp.editor;

const {
	TextControl,
	PanelBody,
	Icon
} = wp.components;

const { Fragment } = wp.element;

const { select, dispatch } = wp.data;

const blockAttributes = {
	plugin_id: {
		type: 'string',
	},
	plan_id: {
		type: 'string',
	},
	public_key: {
		type: 'string',
	},
};

const allowedBlockAligmnents =  [];


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
registerBlockType( 'wpm/freemius-btn', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Freemius Buy Button', 'wp-munich-blocks' ), // Block title.
	description: __( 'A block to create a freemius buy button on the fly.', 'wp-munich-blocks' ),

	icon: {
			src: icons.freemius,
			background: '#003450',
			foreground: '#fff'
	},

	category: 'wpmunich', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wpmunich', 'wp-munich-blocks'  ),
		__( 'freemius', 'wp-munich-blocks'  ),
	],

	attributes: blockAttributes,

	deprecated: [
	],

	// The "edit" property must be a valid function.
	edit: ( { attributes, setAttributes, isSelected, className, clientId } ) => {

		const {
			plugin_id,
			plan_id,
			public_key,
		} = attributes;

		/**
		 * Keep the freemius url synced with the child block
		 */
		const onChangeUrl = ( plugin_id, plan_id ) => {
			// Grab the current block
		  var button = select('core/editor').getBlocksByClientId(clientId)[0].innerBlocks[0];

		  if ( ! button ) {
				return;
			}

			let url = '';

			if( ! isEmpty( plugin_id ) ) {
				url = 'https://checkout.freemius.com/mode/dialog/plugin/' + plugin_id + '/';
			}

			if( ! isEmpty( plugin_id ) && ! isEmpty( plan_id ) ) {
				url = url + 'plan/' + plan_id + '/';
			}

			// Update the correct block's attributes
			dispatch('core/editor').updateBlockAttributes(button.clientId, {
				url: url,
			})
		}

		onChangeUrl( plugin_id, plan_id );

		// Create the needed controls
		const controls = isSelected && [
			<BlockControls key="controls">

			</BlockControls>,
			<InspectorControls key="inspector">
			<PanelBody
				title={ __('Freemius Settings', 'wpm_blocks' ) }
				initialOpen={ true }
			>
			<TextControl
				label={ __( 'Plugin ID', 'wpm_blocks' ) }
				help={ __( 'Required product ID (whether it’s a plugin, theme, add-on, or SaaS).', 'wpm_blocks' ) }
				value={ plugin_id }
				onChange={ ( plugin_id ) => setAttributes( { plugin_id } ) }
			/>
			<TextControl
				label={ __( 'Plan ID', 'wpm_blocks' ) }
				help={ __( 'The ID of the plan that will load with the checkout.', 'wpm_blocks' ) }
				value={ plan_id }
				onChange={ ( plan_id ) => setAttributes( { plan_id } ) }
			/>
			<TextControl
				label={ __( 'Public Key', 'wpm_blocks' ) }
				help={ __( 'Require product public key.', 'wpm_blocks' ) }
				value={ public_key }
				onChange={ ( public_key ) => setAttributes( { public_key } ) }
			/>
			</PanelBody>
			</InspectorControls>
		];


		const blockClassNames = classnames( className, {

		} );

		const buttonTemplate = [
			[
				'core/button',
				{}
			],
		];

		// Creates the editor output
		return [
			controls,
			<div className={ blockClassNames }>
				<InnerBlocks
				 	template={ buttonTemplate }
					templateLock={ 'all' }
					templateInsertUpdatesSelection={ false }
				/>
			</div>
		];
	},

	// The "save" property must be specified and must be a valid function.
	save: function( { attributes, setAttributes, isSelected, className } ) {
		const {
			plugin_id,
			plan_id,
			public_key,
		} = attributes;

		const blockClassNames = classnames( className, {

		} );

		const blockStyles = {

		};
		// Creates the editor output
		return (
			<div
				className={ blockClassNames }
				data-plugin-id={ plugin_id }
				data-plan-id={ plan_id }
				data-public-key={ public_key }
				>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
