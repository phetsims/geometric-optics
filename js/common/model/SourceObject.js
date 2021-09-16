// Copyright 2021, University of Colorado Boulder

/**
 * Model element for object (in the sense commonly used in geometric optic) or source of light
 * The sourceObject has a position and a "second source" position within it.
 *
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class SourceObject {

  /**
   * @param {Property.<Vector2>} opticPositionProperty
   * @param {Property.<Representation>} representationProperty
   */
  constructor( opticPositionProperty, representationProperty ) {

    const scale = representationProperty.value.isObject ?
                  GeometricOpticsConstants.OBJECT_SCALE_FACTOR :
                  GeometricOpticsConstants.SOURCE_SCALE_FACTOR;

    // {Vector2} displacement vector from the firstPosition to the left top - value depends on representation
    // values are in centimeters
    let offset = representationProperty.value.rightFacingUprightOffset.dividedScalar( scale );

    // @public {Property.<Vector2>} position of the left top position of image
    this.leftTopProperty = new Vector2Property( GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1.plus( offset ) );

    // @public {DerivedProperty.<Vector2>} position of the source/object
    this.firstPositionProperty = new DerivedProperty(
      [ this.leftTopProperty ],
      leftTop => leftTop.minus( offset )
    );

    // @public {DerivedProperty.<Bounds2>} model bounds of the source/object Image ( in the scenery sense)
    this.boundsProperty = new DerivedProperty(
      [ this.leftTopProperty, representationProperty ],
      ( leftTop, representation ) => {
        const scale = representation.isObject ?
                      GeometricOpticsConstants.OBJECT_SCALE_FACTOR :
                      GeometricOpticsConstants.SOURCE_SCALE_FACTOR;
        const size = new Dimension2( representation.rightFacingUpright.width / scale,
          representation.rightFacingUpright.height / scale );
        return size.toBounds( leftTop.x, leftTop.y - size.height );
      } );

    // @private {Property.<Vector2>} position of the second source of light
    this.unconstrainedSecondSourcePositionProperty = new Vector2Property( GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2 );

    // @private {Property.<number>} vertical offset (in centimeters) of second object with respect to the first
    this.verticalOffsetProperty = new NumberProperty( GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE.defaultValue, {
      range: GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE
    } );

    // REVIEW: This is not just the initial position, as it is a Property that changes with the optic, right? If not this needs more explanation.
    // @public (read-only) {Vector2} initial position of the optic
    this.opticPositionProperty = opticPositionProperty;

    // @public {DerivedProperty.<Vector2>} position of the second source (source/object)
    this.secondPositionProperty = new DerivedProperty(
      [ this.firstPositionProperty, this.verticalOffsetProperty,
        this.unconstrainedSecondSourcePositionProperty, representationProperty ],
      ( firstPosition, verticalOffset, unconstrainedSecondSourcePosition, representation ) => {
        if ( representation.isObject ) {
          return firstPosition.plusXY( 0, verticalOffset );
        }
        else {
          return unconstrainedSecondSourcePosition;
        }
      } );

    // update the left top position when the representation changes
    representationProperty.link( representation => {

      const scale = representation.isObject ?
                    GeometricOpticsConstants.OBJECT_SCALE_FACTOR :
                    GeometricOpticsConstants.SOURCE_SCALE_FACTOR;

      // {Vector2} update the value of the offset
      offset = representation.rightFacingUprightOffset.dividedScalar( scale );

      // {Vector2} update the left top position - the firstPosition is the ground truth when changing representation
      this.leftTopProperty.value = this.firstPositionProperty.value.plus( offset );
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.verticalOffsetProperty.reset();
    this.unconstrainedSecondSourcePositionProperty.reset();
    this.leftTopProperty.reset();
  }

  /**
   * Returns the position of the source
   * @public
   * @returns {Vector2}
   */
  getPosition() {
    return this.firstPositionProperty.value;
  }

  /**
   * Sets the second source point
   * @public
   * @param {Property.<Representation>} representationProperty
   * @param {Vector2} position
   */
  setSecondPoint( representationProperty, position ) {
    if ( representationProperty.value.isObject ) {
      const unconstrainedVerticalOffset = position.y - this.firstPositionProperty.value.y;
      this.verticalOffsetProperty.value = Utils.clamp( unconstrainedVerticalOffset,
        GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE.min,
        GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE.max );
    }
    else {
      this.unconstrainedSecondSourcePositionProperty.value = position;
    }
  }

  /**
   * Gets the position of the optic
   * @public
   * @returns {Vector2} position
   */
  getOpticPosition() {
    return this.opticPositionProperty.value;
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;