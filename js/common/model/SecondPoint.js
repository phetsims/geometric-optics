// Copyright 2021, University of Colorado Boulder

/**
 * SecondPoint is the model of the second point on the source object, and the second light source.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geometricOptics from '../../geometricOptics.js';

// initial position of the second light source, in cm
const INITIAL_LIGHT_SOURCE_POSITION = new Vector2( -150, -20 );

// range of the vertical offset for the second point, relative to the Object, in cm
const VERTICAL_OFFSET_RANGE = new RangeWithValue( -55, 0, -52 );

class SecondPoint {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Property.<Vector2>} sourceObjectPositionProperty
   * @param {Object} [options]
   */
  constructor( representationProperty, sourceObjectPositionProperty, options ) {

    assert && assert( representationProperty instanceof EnumerationProperty );
    assert && assert( sourceObjectPositionProperty instanceof Property );

    // @private position of the second light source
    this.lightSourcePositionProperty = new Vector2Property( INITIAL_LIGHT_SOURCE_POSITION );

    // @private vertical offset of second point with respect to the first object, in cm
    this.verticalOffsetProperty = new NumberProperty( VERTICAL_OFFSET_RANGE.defaultValue, {
      range: VERTICAL_OFFSET_RANGE
    } );

    // @public {DerivedProperty.<Vector2>} position of the second point or second light source
    this.positionProperty = new DerivedProperty(
      [ sourceObjectPositionProperty, this.verticalOffsetProperty,
        this.lightSourcePositionProperty, representationProperty ],
      ( sourceObjectPosition, verticalOffset, lightSourcePosition, representation ) =>
        representation.isObject ? sourceObjectPosition.plusXY( 0, verticalOffset ) : lightSourcePosition
    );

    // @private
    this.sourceObjectPositionProperty = sourceObjectPositionProperty;
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.verticalOffsetProperty.reset();
    this.lightSourcePositionProperty.reset();
  }

  /**
   * Sets the second source point
   * @public
   * @param {boolean} isObject
   * @param {Vector2} position
   */
  setSecondPoint( isObject, position ) {
    assert && assert( typeof isObject === 'boolean' );
    assert && assert( position instanceof Vector2 );

    if ( isObject ) {
      this.verticalOffsetProperty.value = VERTICAL_OFFSET_RANGE.constrainValue(
        position.y - this.sourceObjectPositionProperty.value.y );
    }
    else {
      this.lightSourcePositionProperty.value = position;
    }
  }
}

geometricOptics.register( 'SecondPoint', SecondPoint );
export default SecondPoint;