/**
 * CONTROL: Direction
 *
 * Render a control to select a direction
 */

 /**
  * External Dependencies
  */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const {
	BaseControl,
} = wp.components;

const {
	withInstanceId
} = wp.compose;


function DirectionControl ( {
	onChange,
	instanceId,
	selected,
	className,
	label
} ) {
	const onChangeValue = ( event ) => onChange( event.target.value );
	const id = `inspector-direction-control-${ instanceId }`;
	const directions = [
		'top-left',    'top-center',    'top-right',
		'center-left', 'center-center', 'center-right',
		'bottom-left', 'bottom-center', 'bottom-right',
	];

	return (
		<BaseControl className={ classnames( className, 'components-direction-control' ) } label={ label }>
		 { directions.map( ( direction, index ) => (
				<input
					id={ `${ id }-${ direction }` }
					className='components-radio-control__direction'
					type="radio"
					name={ id }
					value={ direction }
					onChange={ onChangeValue }
					checked={ direction === selected }
				/>
			) ) }
		</BaseControl>
	);
}

export default withInstanceId( DirectionControl );
