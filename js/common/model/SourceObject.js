// Copyright 2021, University of Colorado Boulder

/**
 * Model element for object (in the sense commonly used in geometric optic) or source of light
 * The sourceObject has a position and a "second source" position within it.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';

class SourceObject {

  /**
   * @param {EnumerationProperty.<Representation>} representationProperty
   */
  constructor( representationProperty ) {
    assert && assert( representationProperty instanceof EnumerationProperty );

    // {Vector2} displacement vector from the firstPosition to the left top - value depends on representation
    // values are in centimeters
    //TODO this feels unnecessary, and causes ordering dependencies herein
    let offset = representationProperty.value.rightFacingUprightOffset.dividedScalar(
      representationProperty.value.getScaleFactor()
    );

    // @public position of the left top position of image
    //TODO should this be derived from representationProperty? or from positionProperty?
    //TODO left-top is unfortunate to have in the model, can this be avoided?
    this.leftTopProperty = new Vector2Property( GeometricOpticsConstants.DEFAULT_SOURCE_POINT_1.plus( offset ) );

    // @public {DerivedProperty.<Vector2>} position of the source/object
    //TODO should this be derived from representationProperty instead?
    this.positionProperty = new DerivedProperty(
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

    // update the left top position when the representation changes
    representationProperty.link( representation => {

      // {Vector2} update the value of the offset
      offset = representation.rightFacingUprightOffset.dividedScalar( representation.getScaleFactor() );

      // {Vector2} update the left top position - the firstPosition is the ground truth when changing representation
      this.leftTopProperty.value = this.positionProperty.value.plus( offset );
    } );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.leftTopProperty.reset();
  }

  //TODO this is redundant, use this.positionProperty.value
  /**
   * Returns the position of the source
   * @public
   * @returns {Vector2}
   */
  getPosition() {
    return this.positionProperty.value;
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;