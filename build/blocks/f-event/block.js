/**
 * BLOCK: background-block
 * TIER: FREE
 *
 * Registering a basic test block with Gutenberg.
 */

/**
 * External Dependencies
 */
import { isEmpty, map, startCase } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';
import { getAvailableSizes, getLargestAvailableSize } from '../common/common';
import { save_deprecated_081218 } from './deprecations';
/**
 * WordPress dependencies
 */
const { registerBlockType } = wp.blocks;
const { compose, withState } = wp.compose;
const { withSelect } = wp.data;
const { __experimentalGetSettings, dateI18n } = wp.date;
const {
	__,
	sprintf
} = wp.i18n;

const {
	MediaUpload,
	MediaPlaceholder,
	BlockControls,
	InspectorControls,
	ContrastChecker,
	BlockAlignmentToolbar,
	getColorClassName,
	withColors,
	PanelColorSettings,
	RichText,
} = wp.editor;

const {
	Button,
	ButtonGroup,
	PanelBody,
	ToggleControl,
	TextControl,
	Toolbar,
	SelectControl,
	BaseControl,
	DateTimePicker,
} = wp.components;

const { Fragment } = wp.element;

const blockAttributes = {
	// Image
	url: {
		type: 'string',
	},
	fullUrl: {
		type: 'string',
	},
	id: {
		type: 'number',
	},
	alt: {
		type: 'string',
	},

	// layout
	alignment: {
		type: 'string',
	},

	// Colors
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

	// Event Data
	eventName: {
		type: 'string',
	},
	startDate: {
		type: 'string',
	},
	endDate: {
		type: 'string',
	},
	hasEndDate: {
		type: 'bool',
		default: false,
	},
	eventContent: {
		type: 'children',
		source: 'html',
		multiline: 'p',
		selector: '.event-description',
	},
	eventName: {
		type: 'string',
		source: 'html',
		selector: '.event-title',
	},

	// Location Data
	locationName: {
		type: 'string',
	},
	locationStreetAddress: {
		type: 'string',
	},
	locationAddressLocality: {
		type: 'string',
	},
	locationPostalCode: {
		type: 'string',
	},
	locationAddressRegion: {
		type: 'string',
	},
	locationAddressCountry: {
		type: 'string',
	},
};

const allowedBlockAligmnents =  ['left', 'right'];


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
registerBlockType( 'wpm/event', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Event', 'wp-munich-blocks' ), // Block title.
	description: __( 'Display an event with the needed meta information and provide Google with structured data about that event.', 'wp-munich-blocks' ),

	icon: {
			src: icons.event,
			background: '#003450',
			foreground: '#fff'
	},

	category: 'wpmunich', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'wpmunich', 'wp-munich-blocks'  ),
		__( 'event', 'wp-munich-blocks'  ),
	],

	attributes: blockAttributes,

	getEditWrapperProps( attributes ) {
		const { alignment } = attributes;
		return { 'data-align': alignment };
	},

	deprecated: [
		{
			attributes: blockAttributes,
			save: save_deprecated_081218,
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

		} )
	] ) ( ( { attributes, setAttributes, isSelected, className, backgroundColor, textColor, setBackgroundColor, setTextColor, image } ) => {

		const {
				url,
				fullUrl,
				id,
				alt,
				alignment,
				hasEndDate,
				locationName,
				locationStreetAddress,
				locationAddressLocality,
				locationPostalCode,
				locationAddressRegion,
				locationAddressCountry,
				eventContent,
				eventName,
				startDate,
				endDate,
		} = attributes;

		const settings = __experimentalGetSettings();

		// To know if the current timezone is a 12 hour time with look for an "a" in the time format.
		// We also make sure this a is not escaped by a "/".
		const is12HourTime = /a(?!\\)/i.test(
			settings.formats.time
				.toLowerCase() // Test only the lower case a
				.replace( /\\\\/g, '' ) // Replace "//" with empty strings
				.split( '' ).reverse().join( '' ) // Reverse the string and test for "a" not followed by a slash
		);

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
					fullUrl: image.url,
				}
			);
		}
		const onResetImage = ( media ) => setAttributes( { alt: null, id: null, url: null } );

		const imagePlaceholder = (
			<MediaPlaceholder
				key="image-placeholder"
				icon="format-image"
				labels={ {
					title: __( 'Image', 'wp-munich-blocks' ),
					name: __( 'image', 'wp-munich-blocks' )
				} }
				className={ 'event-image' }
				onSelect={ onSelectImage }
				accept="image/*"
				allowedTypes={ ['image'] }
			/>
		);

		// The center image component
		let imgDisplay = imagePlaceholder;
		if( hasImage ) {

			let imgClassName = classnames( "event-image", {
				[`wp-image-${ id }`] : id,
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
				</PanelBody>
				<PanelBody title={ __( 'Start Date', 'wp-munich-blocks' ) } initialOpen={ false }>
					<DateTimePicker
						currentDate={ startDate }
						onChange={ ( startDate ) => setAttributes( { startDate } ) }
						is12Hour={ is12HourTime }
					/>
				</PanelBody>
				<PanelBody title={ __( 'End Date', 'wp-munich-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __('Has end date', 'wp-munich-blocks' ) }
						checked={ hasEndDate }
						onChange={ ( hasEndDate ) => { setAttributes( { hasEndDate } ) } }
					/>
					{ hasEndDate && (
						<DateTimePicker
							currentDate={ endDate }
							onChange={ ( endDate ) => { console.log( endDate ); setAttributes( { endDate } ) } }
							is12Hour={ is12HourTime }
						/>
					) }
				</PanelBody>
				<PanelBody title={ __('Location', 'wp-munich-blocks' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Name', 'wp-munich-blocks' ) }
						help={ __( 'The name of the location.', 'wp-munich-blocks' ) }
						value={ locationName }
						onChange={ ( locationName ) => { setAttributes( { locationName } ) } }
					/>

					<TextControl
						label={ __( 'Street Address', 'wp-munich-blocks' ) }
						help={ __( 'The street address. For example, 1600 Amphitheatre Pkwy.', 'wp-munich-blocks' ) }
						value={ locationStreetAddress }
						onChange={ ( locationStreetAddress ) => { setAttributes( { locationStreetAddress } ) } }
					/>

					<TextControl
						label={ __( 'Address Locality', 'wp-munich-blocks' ) }
						help={ __( 'The locality. For example, Mountain View.', 'wp-munich-blocks' ) }
						value={ locationAddressLocality }
						onChange={ ( locationAddressLocality ) => { setAttributes( { locationAddressLocality } ) } }
					/>

					<TextControl
						label={ __( 'Postal Code', 'wp-munich-blocks' ) }
						help={ __( 'The postal code. For example, 94043.', 'wp-munich-blocks' ) }
						value={ locationPostalCode }
						onChange={ ( locationPostalCode ) => { setAttributes( { locationPostalCode } ) } }
					/>

					<TextControl
						label={ __( 'Region', 'wp-munich-blocks' ) }
						help={ __( 'The region. For example, CA.', 'wp-munich-blocks' ) }
						value={ locationAddressRegion }
						onChange={ ( locationAddressRegion ) => { setAttributes( { locationAddressRegion } ) } }
					/>

					<TextControl
						label={ __( 'Country', 'wp-munich-blocks' ) }
						help={ __( 'The country. For example, USA.', 'wp-munich-blocks' ) }
						value={ locationAddressCountry }
						onChange={ ( locationAddressCountry ) => { setAttributes( { locationAddressCountry } ) } }
					/>
				</PanelBody>
			</InspectorControls>
		];

		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const blockClassNames = classnames( className, {
			[ `align${ alignment }` ]: alignment,
			[ textColor.class ]: textColor.class,
			[ backgroundColor.class ]: backgroundColor.class,
		} );

		const blockStyles = {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
		};

		// Creates the editor output
		return [
			controls,
			<div className={ blockClassNames } style={ blockStyles }>
				{ imgDisplay }
				<div class="event-datetime-square">
					<span class="day">{ dateI18n( 'd', startDate ) }</span>
					<span class="month">{ dateI18n( 'M', startDate ) }</span>
				</div>
				<RichText
					tagName={ 'h2' }
					wrapperClassName={ 'event-title' }
					formattingControls={ [] }
					keepPlaceholderOnFocus
					value={ eventName }
					onChange={ ( eventName ) => setAttributes( { eventName } ) }
					placeholder={ __('Event Title', 'wp-munich-blocks' ) }
				/>
				<div className={ 'event-datetime' }>
					<span className={ 'event-startdate' }> { dateI18n( settings.formats.datetime, startDate ) } </span>
					{ hasEndDate && (
						<span className={ 'event-enddate' }> - { dateI18n( settings.formats.datetime, endDate ) } </span>
					) }
				</div>
				<address className={ 'event-address' }>
					{ ! isEmpty( locationName ) && (
						<span className={ 'location-name location-detail' } > { locationName } </span>
					) }
					{ ! isEmpty( locationStreetAddress ) && (
						<span className={ 'location-street-address location-detail' } > { locationStreetAddress } </span>
					) }
					{ ! isEmpty( locationPostalCode ) && (
						<span className={ 'location-postal-code location-detail' } > { locationPostalCode } </span>
					) }
					{ ! isEmpty( locationAddressLocality ) && (
						<span className={ 'location-address-locality location-detail' } > { locationAddressLocality } </span>
					) }
					{ ! isEmpty( locationAddressRegion ) && (
						<span className={ 'location-address-region location-detail' } > { locationAddressRegion } </span>
					) }
					{ ! isEmpty( locationAddressCountry ) && (
						<span className={ 'location-address-country location-detail' } > { locationAddressCountry } </span>
					) }
				</address>
				<RichText
					value={ eventContent }
					multiline={ true }
					onChange={ ( eventContent ) => setAttributes( { eventContent } ) }
					placeholder={ __('Event Description', 'wp-munich-blocks' ) }
					wrapperClassName={ 'event-description' }
					keepPlaceholderOnFocus
				/>
			</div>
		];
	}),

	// The "save" property must be specified and must be a valid function.
	save: function( { attributes, setAttributes, isSelected, className } ) {
		const {
			backgroundColor,
			textColor,
			customBackgroundColor,
			customTextColor,
			url,
			id,
			alt,
			alignment,
			hasEndDate,
			locationName,
			locationStreetAddress,
			locationAddressLocality,
			locationPostalCode,
			locationAddressRegion,
			locationAddressCountry,
			eventContent,
			eventName,
			startDate,
			endDate,
		} = attributes;

		const hasImage = ! isEmpty( url );

		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const settings = __experimentalGetSettings();

		// To know if the current timezone is a 12 hour time with look for an "a" in the time format.
		// We also make sure this a is not escaped by a "/".
		const is12HourTime = /a(?!\\)/i.test(
			settings.formats.time
				.toLowerCase() // Test only the lower case a
				.replace( /\\\\/g, '' ) // Replace "//" with empty strings
				.split( '' ).reverse().join( '' ) // Reverse the string and test for "a" not followed by a slash
		);

		// The center image component
		let imgDisplay = null;
		if( hasImage ) {

			let imgClassName = classnames( "event-image", {
				[`wp-image-${ id }`] : id,
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

		const blockClassNames = classnames( className, {
			[ `align${ alignment }` ]: alignment,
			[ `align${ alignment }-padding` ]: alignment,
			[ textClass ]: textClass,
			[ backgroundClass ]: backgroundClass,
		} );

		const blockStyles = {
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			color: textClass ? undefined : customTextColor,
		};

		// Creates the editor output
		return (
			<div className={ blockClassNames } style={ blockStyles }>
				{ imgDisplay }
				<div class="event-datetime-square">
					<span class="day">{ dateI18n( 'd', startDate ) }</span>
					<span class="month">{ dateI18n( 'M', startDate ) }</span>
				</div>
				<RichText.Content
					tagName={ 'h2' }
					className={ 'event-title' }
					value={ eventName }
				/>
				<div className={ 'event-datetime' }>
					<span className={ 'event-startdate' }> { dateI18n( settings.formats.datetime, startDate ) } </span>
					{ hasEndDate && (
						<span className={ 'event-enddate' }> - { dateI18n( settings.formats.datetime, endDate ) } </span>
					) }
				</div>
				<address className={ 'event-address' }>
					{ ! isEmpty( locationName ) && (
						<span className={ 'location-name location-detail' } > { locationName } </span>
					) }
					{ ! isEmpty( locationStreetAddress ) && (
						<span className={ 'location-street-address location-detail' } > { locationStreetAddress } </span>
					) }
					{ ! isEmpty( locationPostalCode ) && (
						<span className={ 'location-postal-code location-detail' } > { locationPostalCode } </span>
					) }
					{ ! isEmpty( locationAddressLocality ) && (
						<span className={ 'location-address-locality location-detail' } > { locationAddressLocality } </span>
					) }
					{ ! isEmpty( locationAddressRegion ) && (
						<span className={ 'location-address-region location-detail' } > { locationAddressRegion } </span>
					) }
					{ ! isEmpty( locationAddressCountry ) && (
						<span className={ 'location-address-country location-detail' } > { locationAddressCountry } </span>
					) }
				</address>
				<div className={ 'event-description' }>
					<RichText.Content
						value={ eventContent }
						multiline={ true }
					/>
				</div>
				<script type="application/ld+json">
					{ JSON.stringify( createEventJsonLd( attributes ) ) }
				</script>
			</div>
		);
	},
} );

const createEventJsonLd = ( attributes ) => {
	const {
			fullUrl,
			hasEndDate,
			locationName,
			locationStreetAddress,
			locationAddressLocality,
			locationPostalCode,
			locationAddressRegion,
			locationAddressCountry,
			eventContent,
			eventName,
			startDate,
			endDate,
		} = attributes;

	let object = {};

	// Schema.org attributes
	object['@context'] = 'http://www.schema.org';
	object['@type'] = 'Event';

	if( fullUrl ) {
		object.image = fullUrl;
	}

	// Base Data
	object.name = eventName;

	if( startDate ) {
		object.startDate = dateI18n( 'c', startDate );
	}

	if( hasEndDate || hasEndDate ) {
		object.endDate = dateI18n( 'c', endDate );
	}

	// Strip html tags from the event content
	const helperDiv = document.createElement('div');
	helperDiv.innerHTML = eventContent;
	const strippedEventContent = helperDiv.textContent || helperDiv.innerText || null;

	// The event content
	if( strippedEventContent ) {
		object.description = strippedEventContent;
	}

	// Location
	object.location = {};
	object.location['@type'] = 'Place';

	if( locationName ) {
		object.location.name = locationName;
	}

	// Location Address
	object.location.address = {};
	object.location.address['@type'] = 'PostalAddress';

	if( locationStreetAddress ) {
		object.location.address.streetAddress = locationStreetAddress;
	}

	if( locationPostalCode ) {
		object.location.address.postalCode = locationPostalCode;
	}

	if( locationAddressLocality ) {
		object.location.address.addressLocality = locationAddressLocality;
	}

	if( locationAddressRegion ) {
		object.location.address.addressRegion = locationAddressRegion;
	}

	if( locationAddressCountry ) {
		object.location.address.addressCountry = locationAddressCountry;
	}

	return object;
}
