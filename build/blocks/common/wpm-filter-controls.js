/**
 * BLOCK CONTROL: An adittional control to remove the bottom margin on blocks.
 */

/**
 * External dependencies
 */
import { uniq, find } from 'lodash';
import icons from './icons';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { PanelBody, SelectControl } = wp.components;
const { hasBlockSupport } = wp.blocks;

const allowedBlocks = [
	'core/image',
	'core/gallery',
];

/**
 * The HOC that holds our controls
 */
const wpmImageFilter =  createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {

		const panelTitle = __('Image Filter', 'wp-munich-blocks' );

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
		const addCustomClassName = ( customClassName, className ) => {
			let newClassName = '';
			if ( typeof className !== 'string' ) {
				newClassName = customClassName;
			} else {
				newClassName = uniq( [
					customClassName,
					...className.split( ' ' ),
				] ).join( ' ' ).trim();
			}

			return newClassName;
		}

		/**
		 * Remove the custom class name
		 *
		 * @param  {string} customClassName The class name we want to remove
	 	 */
		const removeCustomClassName = ( customClassName, className ) => {

			let classNameArray = className.split( ' ' );
			classNameArray.splice( classNameArray.indexOf( customClassName ), 1 );
			let newClassName = classNameArray.join( ' ' ).trim();

			return newClassName;
		}

		const filterArray = [
			{
				label: __( 'Select Filter', 'wp-munich-blocks' ),
				value: false,
			},
			...wpMunichFilters
		];

		// Get the name of the currently selected filter
		const getFilterName = ( hover = false) => {
			// If the className attribute is not a string, wo don't have any classes
			if ( typeof props.attributes.className !== 'string' ) {
				return false;
			}

			// Split the className string into an array
			let classNamesArray = props.attributes.className.split( ' ' );

			// Set the default value of our filterName
			let filterName = false;

			// Set the regex to look for
			let regEx = /has-filter-(\w+)/g;

			if ( hover ) {
				regEx = /has-hover-filter-(\w+)/g;
			}

			// Find the filter class in our classNamesArray
			const filterClass = find(classNamesArray, (o) => {
				return o.match( regEx );
			});

			// If we have a match, get the filterName
			if ( typeof filterClass !== 'undefined' ) {
				const res = regEx.exec(filterClass);
				if ( res !== null ) {
					filterName = res[1];
				}
			}

			// Return the filterName or false
			return filterName;
		}

		/**
		 * On change the new filter
		 *
		 * @param  {string} newFilter The new filter to add
		 *
		 * @return {void}
		 */
		const onChangeFilter = ( newFilter ) => {

			// Load the classname string
			let className = props.attributes.className;

			// Remove the current filter (if we have one)
			if ( getFilterName() ) {
				className = removeCustomClassName( 'has-filter-' + getFilterName(), className );
			}

			// Set the new filter (if we have one and it is not 'false')
			if ( newFilter && newFilter !== 'false' ) {
				className = addCustomClassName( 'has-filter-' + newFilter, className );
			}

			// Write our changed className into the block attributes
			props.setAttributes( { className: className } );
		}

		/**
		 * On change the new filter on hover
		 *
		 * @param  {string} newFilter The new filter to add
		 *
		 * @return {void}
		 */
		const onChangeFilterHover = ( newFilter ) => {

			// Load the classname string
			let className = props.attributes.className;

			// Remove the current filter (if we have one)
			if ( getFilterName( true ) ) {
				className = removeCustomClassName( 'has-hover-filter-' + getFilterName( true ), className );
			}

			// Set the new filter (if we have one and it is not 'false')
			if ( newFilter && newFilter !== 'false' ) {
				className = addCustomClassName( 'has-hover-filter-' + newFilter, className );
			}

			// Write our changed className into the block attributes
			props.setAttributes( { className: className } );
		}

		// Check if custom classNames are allowed and if the block is selected and if the block is in the allowedBlocks array
		if ( allowsCustomClassName && props.isSelected && allowedBlocks.indexOf( props.name ) !== -1 ) {
			return (
				<Fragment>
					<BlockEdit { ...props } />
					<InspectorControls>
						<PanelBody icon={ icons.wpmunich } title={ panelTitle } initialOpen={ false }>
							<p>
								{ __( 'You can use these filters to create stunning color effects on the main image(s) of the selected block.', 'wp-munich-blocks' ) }
							</p>
							<SelectControl
								label={ __( 'Image Filter', 'wp-munich-blocks' ) }
								value={ getFilterName() }
								options={ filterArray }
								onChange={ onChangeFilter }
							/>
							<hr />
							<SelectControl
								label={ __( 'Image Filter on Hover', 'wp-munich-blocks' ) }
								value={ getFilterName( true ) }
								options={ filterArray }
								onChange={ onChangeFilterHover }
							/>
						</PanelBody>
					</InspectorControls>
				</Fragment>
			);
		} else {
			return ( <BlockEdit { ...props } /> );
		}
	};
}, "wpmImageFilter" );

wp.hooks.addFilter( 'editor.BlockEdit', 'wpm/with-filter-controls', wpmImageFilter );
