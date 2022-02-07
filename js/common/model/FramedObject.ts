// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObject is the model for the "framed objects". These are objects in a picture frame, with 3D perspective.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Representation from './Representation.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import SecondPoint from './SecondPoint.js';

class FramedObject extends OpticalObject {

  // a second point of interest on the framed object
  public readonly secondPoint: SecondPoint;

  // model bounds of the Object's visual representation
  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  private readonly resetFramedObject: () => void;

  /**
   * @param representationProperty
   * @param options
   */
  constructor( representationProperty: IReadOnlyProperty<Representation>, options: OpticalObjectOptions ) {

    super( options );

    this.secondPoint = new SecondPoint( this.positionProperty );

    this.boundsProperty = new DerivedProperty(
      [ representationProperty, this.positionProperty ],
      ( representation: Representation, position: Vector2 ) => {

        const scaleFactor = representation.scaleFactor;

        const htmlImageElementWidth = representation.rightFacingUpright.width;
        const htmlImageElementHeight = representation.rightFacingUpright.height;
        const size = new Dimension2( scaleFactor * htmlImageElementWidth, scaleFactor * htmlImageElementHeight );

        const origin = representation.rightFacingUprightOrigin.timesScalar( scaleFactor );
        const offsetX = origin.x;
        const offsetY = -origin.y;  // flip sign of offset.y because +y is up in the model
        const left = position.x - offsetX;
        const bottom = position.y - offsetY - size.height;

        return size.toBounds( left, bottom );
      }, {

        // Because changing representationProperty may necessitate changing positionProperty to move
        // the Object inside the view's drag bounds, resulting in this derivation being called again.
        reentrant: true
      } );

    this.resetFramedObject = () => {
      this.secondPoint.reset();
    };
  }

  public reset() {
    super.reset();
    this.resetFramedObject();
  }
}

geometricOptics.register( 'FramedObject', FramedObject );
export default FramedObject;