// Copyright 2021-2022, University of Colorado Boulder

/**
 * HTMLImageElementObject is the base-class model for all optical objects that use an HTMLImageElement for their
 * visual representation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../geometricOptics.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { PickOptional } from '../../../../phet-core/js/types/PickOptional.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type HTMLImageElementObjectOptions = PickRequired<OpticalObjectOptions, 'position' | 'tandem'>
  & PickOptional<OpticalObjectOptions, 'phetioDocumentation'>;

class HTMLImageElementObject extends OpticalObject {

  // Where the point-of-interest is relative to the left-top corner of the HTMLImageElement.
  // This should be uniform for all values of htmlImageElementProperty.
  public readonly originOffset: Vector2;

  // View-to-model scale for the associated HTMLImageElement.
  // This should be uniform for all values of htmlImageElementProperty.
  public readonly scaleFactor: number

  // model bounds of this framed object's visual representation
  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty
   * @param htmlImageElementProperty
   * @param originOffset
   * @param scaleFactor
   * @param providedOptions
   */
  constructor( opticalObjectNumber: number,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               htmlImageElementProperty: IReadOnlyProperty<HTMLImageElement>,
               originOffset: Vector2,
               scaleFactor: number,
               providedOptions: HTMLImageElementObjectOptions ) {
    
    super( opticalObjectNumber, opticPositionProperty, providedOptions );

    this.originOffset = originOffset;
    this.scaleFactor = scaleFactor;

    this.boundsProperty = new DerivedProperty(
      [ htmlImageElementProperty, this.positionProperty ],
      ( htmlImageElement: HTMLImageElement, position: Vector2 ) =>
        computeBounds( htmlImageElement, position, scaleFactor, originOffset ), {

        // Because changing htmlImageElementProperty may necessitate changing positionProperty to move
        // the Object inside the view's drag bounds, resulting in this derivation being called again.
        //TODO is this needed?
        reentrant: true
      } );
  }
}

/**
 * Computes the bounds for an optical object that uses an HTMLImageElement for its visual representation.
 * @param htmlImageElement
 * @param position
 * @param scaleFactor
 * @param originOffset
 */
function computeBounds( htmlImageElement: HTMLImageElement, position: Vector2, scaleFactor: number, originOffset: Vector2 ) {

  const size = new Dimension2( scaleFactor * htmlImageElement.width, scaleFactor * htmlImageElement.height );
  const origin = originOffset.timesScalar( scaleFactor );
  const offsetX = origin.x;
  const offsetY = -origin.y;  // flip sign of offset.y because +y is up in the model
  const left = position.x - offsetX;
  const bottom = position.y - offsetY - size.height;

  return size.toBounds( left, bottom );
}

geometricOptics.register( 'HTMLImageElementObject', HTMLImageElementObject );
export default HTMLImageElementObject;
export type { HTMLImageElementObjectOptions };