// Copyright 2021, University of Colorado Boulder

/**
 * Model element for object (in the sense commonly used in geometric optic) or source of light
 * The sourceObject has a position and a second movable position within it.
 *
 * @author Martin Veillette
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

import Utils from '../../../../dot/js/Utils.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

const DEFAULT_SOURCE_POINT_1 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1;
const DEFAULT_SOURCE_POINT_2 = GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2;
const verticalOffsetRange = new RangeWithValue( -0.5, 0, -0.1 );

class SourceObject {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Tandem} tandem
   */
  constructor( representationProperty, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Vector2>} position of the source/object
    this.positionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_1 );

    // @private {Property.<Vector2>} position of the second source of light
    this.unconstrainedMovablePositionProperty = new Vector2Property( DEFAULT_SOURCE_POINT_2 );

    // @private {Property.<number>} vertical offset (in meters) of second object with respect to the first
    this.verticalOffsetProperty = new NumberProperty( verticalOffsetRange.defaultValue );

    // @public {Property.<Vector2>} position of the movable point (source/object)
    this.movablePositionProperty =
      new DerivedProperty( [ this.positionProperty,
          this.verticalOffsetProperty,
          this.unconstrainedMovablePositionProperty,
          representationProperty ],
        ( position, verticalOffset, unconstrainedPosition, representation ) => {
          if ( representation.isObject ) {
            return position.plusXY( 0, verticalOffset );
          }
          else {
            return unconstrainedPosition;
          }
        } );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.verticalOffsetProperty.reset();
    this.unconstrainedMovablePositionProperty.reset();
  }

  /**
   * Returns the position of the source
   * @returns {Vector2}
   * @public
   */
  getPosition() {
    return this.positionProperty.value;
  }

  /**
   * Sets the position of the source
   * @param {Vector2} position
   * @public
   */
  setPosition( position ) {
    this.positionProperty.value = position;
  }

  /**
   * Sets the movable point
   * @param {EnumerationProperty.<Representation>} representationProperty
   * @param {Vector2} position
   * @public
   */
  setMovablePoint( representationProperty, position ) {
    if ( representationProperty.value.isObject ) {
      const unconstrainedVerticalOffset = position.y - this.positionProperty.value.y;
      const verticalOffset = Utils.clamp( unconstrainedVerticalOffset, verticalOffsetRange.min, verticalOffsetRange.max );
      this.verticalOffsetProperty.value = verticalOffset;
    }
    else {
      this.unconstrainedMovablePositionProperty.value = position;
    }
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;
