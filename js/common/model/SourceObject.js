// Copyright 2021, University of Colorado Boulder

//TODO pull the second source out into its own model element, which depends on SourceObject
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
   * @param {EnumerationProperty.<Representation>} representationProperty
   */
  constructor( representationProperty ) {

    // {Vector2} displacement vector from the firstPosition to the left top - value depends on representation
    // values are in centimeters
    //TODO this feels unnecessary, and causes ordering dependencies herein
    let offset = representationProperty.value.rightFacingUprightOffset.dividedScalar(
      representationProperty.value.getScaleFactor()
    );

    // @public {Property.<Vector2>} position of the left top position of image
    //TODO should this be derived from representationProperty? or from firstPositionProperty?
    this.leftTopProperty = new Vector2Property( GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1.plus( offset ) );

    // @public {DerivedProperty.<Vector2>} position of the source/object
    //TODO should this be derived from representationProperty instead?
    this.firstPositionProperty = new DerivedProperty(
      [ this.leftTopProperty ],
      leftTop => leftTop.minus( offset )
    );

    // @public {DerivedProperty.<Bounds2>} model bounds of the source/object Image
    this.boundsProperty = new DerivedProperty(
      [ this.leftTopProperty, representationProperty ],
      ( leftTop, representation ) => {
        const scaleFactor = representation.getScaleFactor();
        const size = new Dimension2( representation.rightFacingUpright.width / scaleFactor,
          representation.rightFacingUpright.height / scaleFactor );
        return size.toBounds( leftTop.x, leftTop.y - size.height );
      } );

    // @private {Property.<Vector2>} position of the second source of light
    //TODO rename this, document it better
    this.unconstrainedSecondSourcePositionProperty = new Vector2Property( GeometricOpticsConstants.DEFAULT_SOURCE_POINT_2 );

    // @private {Property.<number>} vertical offset (in centimeters) of second object with respect to the first
    //TODO rename this something like secondSourceVerticalOffsetProperty
    this.verticalOffsetProperty = new NumberProperty( GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE.defaultValue, {
      range: GeometricOpticsConstants.SECOND_OBJECT_VERTICAL_RANGE
    } );

    // @public {DerivedProperty.<Vector2>} position of the second source (source/object)
    //TODO rename secondSourcePositionProperty
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

      // {Vector2} update the value of the offset
      offset = representation.rightFacingUprightOffset.dividedScalar( representation.getScaleFactor() );

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
   * @param {EnumerationProperty.<Representation>} representationProperty
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
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;