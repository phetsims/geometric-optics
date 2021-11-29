// Copyright 2021, University of Colorado Boulder

/**
 * SourceObject is the model for what is typically called "Object" in optics, or the first light source.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geometricOptics from '../../geometricOptics.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Property from '../../../../axon/js/Property.js';
import Representation from './Representation.js';

// initial position of the source object, in cm
const INITIAL_POSITION = new Vector2( -170, 30 );

class SourceObject {

  // position of the left top position of image
  public readonly leftTopProperty: Vector2Property;

  // position of the source object or light source
  public readonly positionProperty: DerivedProperty<Vector2>;

  // model bounds of the source object or first light source
  public readonly boundsProperty: DerivedProperty<Bounds2>;

  /**
   * @param representationProperty
   */
  constructor( representationProperty: Property<Representation> ) {

    // {Vector2} displacement vector from the firstPosition to the left top, in cm - value depends on representation
    //TODO this feels unnecessary, and causes ordering dependencies herein
    let offset = representationProperty.value.rightFacingUprightOffset.dividedScalar(
      representationProperty.value.scaleFactor
    );

    //TODO should this be derived from representationProperty? or from positionProperty?
    //TODO left-top is unfortunate to have in the model, can this be avoided?
    this.leftTopProperty = new Vector2Property( INITIAL_POSITION.plus( offset ) );

    //TODO should this be derived from representationProperty instead?
    this.positionProperty = new DerivedProperty<Vector2>(
      [ this.leftTopProperty ],
      ( leftTop: Vector2 ) => leftTop.minus( offset )
    );

    this.boundsProperty = new DerivedProperty<Bounds2>(
      [ this.leftTopProperty, representationProperty ],
      ( leftTop: Vector2, representation: Representation ) => {
        const size = new Dimension2( representation.rightFacingUpright.width / representation.scaleFactor,
          representation.rightFacingUpright.height / representation.scaleFactor );
        return size.toBounds( leftTop.x, leftTop.y - size.height );
      } );

    // update the left top position when the representation changes
    representationProperty.link( representation => {

      // {Vector2} update the value of the offset
      offset = representation.rightFacingUprightOffset.dividedScalar( representation.scaleFactor );

      // {Vector2} update the left top position - positionProperty is the ground truth when changing representation
      this.leftTopProperty.value = this.positionProperty.value.plus( offset );
    } );
  }

  public reset(): void {
    this.leftTopProperty.reset();
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;