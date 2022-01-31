// Copyright 2021-2022, University of Colorado Boulder

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
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

class SourceObject {

  // position of the source object or light source
  public readonly positionProperty: Property<Vector2>;

  // model bounds of the source object or first light source
  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  /**
   * @param representationProperty
   * @param initialPosition
   */
  constructor( representationProperty: IReadOnlyProperty<Representation>, initialPosition: Vector2 ) {

    this.positionProperty = new Vector2Property( initialPosition );

    this.boundsProperty = new DerivedProperty(
      [ representationProperty, this.positionProperty ],
      ( representation: Representation, position: Vector2 ) => {

        const scaleFactor = representation.scaleFactor;

        const htmlImageElementWidth = representation.rightFacingUpright.width;
        const htmlImageElementHeight = representation.rightFacingUpright.height;
        const size = new Dimension2( scaleFactor * htmlImageElementWidth, scaleFactor * htmlImageElementHeight );

        const offset = representation.rightFacingUprightOffset.timesScalar( scaleFactor );
        const leftTop = position.plus( offset );

        return size.toBounds( leftTop.x, leftTop.y - size.height );
      }, {

        // Because changing representationProperty may necessitate changing positionProperty to move
        // the Object inside the view's drag bounds, resulting in this derivation being called again.
        reentrant: true
      } );
  }

  public reset(): void {
    this.positionProperty.reset();
  }
}

geometricOptics.register( 'SourceObject', SourceObject );
export default SourceObject;