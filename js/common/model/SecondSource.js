// Copyright 2021, University of Colorado Boulder

/**
 * SecondSource is the model of the second source.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class SecondSource {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Property.<Vector2>} sourceObjectPositionProperty
   * @param {Object} [options]
   */
  constructor( representationProperty, sourceObjectPositionProperty, options ) {

    // @private position of the second source of light
    //TODO rename this, document it better
    this.unconstrainedPositionProperty = new Vector2Property( GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2 );

    // @private vertical offset (in centimeters) of second object with respect to the first
    this.verticalOffsetProperty = new NumberProperty( GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE.defaultValue, {
      range: GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE
    } );

    // @public {DerivedProperty.<Vector2>} position of the second source (source/object)
    this.positionProperty = new DerivedProperty(
      [ sourceObjectPositionProperty, this.verticalOffsetProperty,
        this.unconstrainedPositionProperty, representationProperty ],
      ( sourceObjectPosition, verticalOffset, unconstrainedSecondSourcePosition, representation ) =>
        representation.isObject ? sourceObjectPosition.plusXY( 0, verticalOffset ) : unconstrainedSecondSourcePosition
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
    this.unconstrainedPositionProperty.reset();
  }

  /**
   * Sets the second source point
   * @public
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Vector2} position
   */
  setSecondPoint( representationProperty, position ) {
    assert && assert( representationProperty instanceof EnumerationProperty );
    assert && assert( position instanceof Vector2 );

    if ( representationProperty.value.isObject ) {
      const unconstrainedVerticalOffset = position.y - this.sourceObjectPositionProperty.value.y;
      this.verticalOffsetProperty.value = Utils.clamp( unconstrainedVerticalOffset,
        GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE.min,
        GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE.max );
    }
    else {
      this.unconstrainedPositionProperty.value = position;
    }
  }
}

geometricOptics.register( 'SecondSource', SecondSource );
export default SecondSource;