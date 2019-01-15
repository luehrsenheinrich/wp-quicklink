/**
 * BLOCK CONTROL: An adittional control to remove the bottom margin on blocks.
 */

/**
 * External dependencies
 */
import { uniq } from 'lodash';
import icons from './icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, CheckboxControl } = wp.components;
const { hasBlockSupport } = wp.blocks;

/**
 * The HOC that holds our controls
 */
const noMarginBottomControl =  createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {

		// The name of the class we add or remove
		const varName = 'has-no-margin-bottom';

		const panelTitle = __('WP Munich', 'wp-munich-blocks' );

		// Check if we actually have custom class names to work with
		const allowsCustomClassName = hasBlockSupport( props.name, 'customClassName', true );

		// Check if the class is in the className attribute
		const hasCustomClassName = () => {
			if ( typeof props.attributes.className !== 'string' ) {
				return false;
			}

			return props.attributes.className.indexOf( varName ) != -1;
		}

		/**
		 * Add the custom class name
		 *
		 * @param {string} customClassName The className we want to add
		 */
		const addCustomClassName = ( customClassName ) => {
			let newClassName = '';
			if ( typeof props.attributes.className !== 'string' ) {
				newClassName = customClassName;
			} else {
				newClassName = uniq( [
					customClassName,
					...props.attributes.className.split( ' ' ),
				] ).join( ' ' ).trim();
			}

			props.setAttributes( { className: newClassName } );
		}

		/**
		 * Remove the custom class name
		 *
		 * @param  {string} customClassName The class name we want to remove
	 	 */
		const removeCustomClassName = ( customClassName ) => {

			let classNameArray = props.attributes.className.split( ' ' );
			classNameArray.splice( classNameArray.indexOf( varName ), 1 );
			let newClassName = classNameArray.join( ' ' ).trim();

			props.setAttributes( { className: newClassName } );
		}

		/**
		 * Toggle function to add/remove the custom class name
		 */
		const toggleCustomClassName = () => {
			if( hasCustomClassName() ) {
				removeCustomClassName( varName );
			} else {
				addCustomClassName( varName );
			}
		}

		// Check if custom classNames are allowed and if the block is selected
		if ( allowsCustomClassName && props.isSelected ) {
			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody icon={ icons.wpmunich } title={ panelTitle } initialOpen={ false }>
							<CheckboxControl
								label={ <strong> { __( 'Remove bottom margin', 'wp-munich-blocks' ) } </strong> }
								help={ __( 'Remove the bottom margin and let the block below directly follow.', 'wp-munich-blocks' ) }
								checked={ hasCustomClassName() }
								onChange={ (value) => { toggleCustomClassName() } }
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		} else {
			return ( <BlockEdit { ...props } /> );
		}
	};
}, "noMarginBottomControl" );

wp.hooks.addFilter( 'editor.BlockEdit', 'wpm/with-block-controls', noMarginBottomControl );
