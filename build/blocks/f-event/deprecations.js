
/**
 * External Dependencies
 */
import { isEmpty, map, startCase } from 'lodash';
import classnames from 'classnames';
import icons from '../common/icons';
import { getAvailableSizes, getLargestAvailableSize } from '../common/common';

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

export const save_deprecated_081218 = function( { attributes, setAttributes, isSelected, className } ) {
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
				{ JSON.stringify( createEventJsonLd_deprecated_081218( attributes ) ) }
			</script>
		</div>
	);
};

const createEventJsonLd_deprecated_081218 = ( attributes ) => {
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
	object.description = eventContent;

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
