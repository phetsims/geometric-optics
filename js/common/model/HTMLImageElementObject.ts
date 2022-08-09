// Copyright 2022, University of Colorado Boulder

/**
 * HTMLImageElementObject is the base-class model for all optical objects that use an HTMLImageElement for their
 * visual representation. Framed objects and light objects are subclasses of this object type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../geometricOptics.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export type HTMLImageElementObjectOptions = PickRequired<OpticalObjectOptions, 'position' | 'tandem'>
  & PickOptional<OpticalObjectOptions, 'phetioDocumentation'>;

export default class HTMLImageElementObject extends OpticalObject {

  // The HTMLImageElement (PNG file) used to visually represent the optical object.
  public readonly htmlImageElementProperty: TReadOnlyProperty<HTMLImageElement>;

  // Where the point-of-interest is relative to the left-top corner of the HTMLImageElement.
  // This should be uniform for all values of htmlImageElementProperty.
  public readonly originOffset: Vector2;

  // View-to-model scale for the associated HTMLImageElement.
  // This should be uniform for all values of htmlImageElementProperty.
  public readonly scaleFactor: number;

  // model bounds of this object's visual representation
  public readonly boundsProperty: TReadOnlyProperty<Bounds2>;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty - position of the optic
   * @param htmlImageElementProperty - see field htmlImageElementProperty
   * @param originOffset - see field originOffset
   * @param scaleFactor - see field scaleFactor
   * @param providedOptions
   */
  public constructor( opticalObjectNumber: number,
                      opticPositionProperty: TReadOnlyProperty<Vector2>,
                      htmlImageElementProperty: TReadOnlyProperty<HTMLImageElement>,
                      originOffset: Vector2,
                      scaleFactor: number,
                      providedOptions: HTMLImageElementObjectOptions ) {

    super( opticalObjectNumber, opticPositionProperty, providedOptions );

    this.htmlImageElementProperty = htmlImageElementProperty;
    this.originOffset = originOffset;
    this.scaleFactor = scaleFactor;

    this.boundsProperty = new DerivedProperty(
      [ htmlImageElementProperty, this.positionProperty ],
      ( htmlImageElement, position ) =>
        computeBounds( htmlImageElement, position, scaleFactor, originOffset )
    );
  }
}

/**
 * Computes the bounds for an optical object that uses an HTMLImageElement for its visual representation.
 * @param htmlImageElement - the PNG file shown for this optical object
 * @param position - position of the optical object
 * @param scaleFactor - see field scaleFactor
 * @param originOffset - see field originOffset
 */
function computeBounds( htmlImageElement: HTMLImageElement, position: Vector2,
                        scaleFactor: number, originOffset: Vector2 ): Bounds2 {

  assert && assert( htmlImageElement.width !== 0 && htmlImageElement.height !== 0, 'htmlImageElement is not loaded' );
  const size = new Dimension2( scaleFactor * htmlImageElement.width, scaleFactor * htmlImageElement.height );
  const origin = originOffset.timesScalar( scaleFactor );
  const offsetX = origin.x;
  const offsetY = -origin.y;  // flip sign of offset.y because +y is up in the model
  const left = position.x - offsetX;
  const bottom = position.y - offsetY - size.height;

  return size.toBounds( left, bottom );
}

geometricOptics.register( 'HTMLImageElementObject', HTMLImageElementObject );