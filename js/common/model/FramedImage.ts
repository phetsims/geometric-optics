// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedImage is the model of the optical image associated with a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import Lens from '../../lens/model/Lens.js';
import Optic from './Optic.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalImage, { OpticalImageOptions } from './OpticalImage.js';
import { ObjectHTMLImageElements } from './OpticalObjectChoice.js';
import FramedObject from './FramedObject.js';
import merge from '../../../../phet-core/js/merge.js';
import { OpticalImageType } from './OpticalImageType.js';

class FramedImage extends OpticalImage {

  // the HTMLImageElement to display, null if there is no HTMLImageElement
  readonly imageProperty: IReadOnlyProperty<HTMLImageElement | null>;

  // Bounds of the optical image's visual representation, in model coordinates
  readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  /**
   * @param framedObjectPositionProperty
   * @param objectHTMLImageElementsProperty
   * @param optic
   * @param providedOptions
   */
  constructor( framedObjectPositionProperty: IReadOnlyProperty<Vector2>,
               objectHTMLImageElementsProperty: IReadOnlyProperty<ObjectHTMLImageElements>,
               optic: Optic,
               providedOptions: OpticalImageOptions ) {

    const options = merge( {}, providedOptions );

    super( framedObjectPositionProperty, optic, options );

    this.imageProperty = new DerivedProperty(
      [ objectHTMLImageElementsProperty, this.opticalImageTypeProperty ],
      ( objectHTMLImageElements: ObjectHTMLImageElements, opticalImageType: OpticalImageType ) => {
        const isLens = ( optic instanceof Lens );
        const realImage = isLens ? objectHTMLImageElements.leftFacingInverted : objectHTMLImageElements.rightFacingInverted;
        const virtualImage = isLens ? objectHTMLImageElements.rightFacingUpright : objectHTMLImageElements.leftFacingUpright;
        return ( opticalImageType === 'real' ) ? realImage : virtualImage;
      } );

    this.boundsProperty = new DerivedProperty(
      [ this.positionProperty, objectHTMLImageElementsProperty, this.magnificationProperty, this.isInvertedProperty ],
      //TODO isInverted is not used, is dependency needed?
      ( position: Vector2, objectHTMLImageElements: ObjectHTMLImageElements, magnification: number, isInverted: boolean ) => {

        const scaleFactor = FramedObject.SCALE_FACTOR;
        const initialOrigin = FramedObject.ORIGIN_OFFSET.timesScalar( scaleFactor );
        const initialWidth = objectHTMLImageElements.rightFacingUpright.width * scaleFactor;
        const initialHeight = objectHTMLImageElements.rightFacingUpright.height * scaleFactor;

        const origin = initialOrigin.timesScalar( magnification );
        const offsetX = -origin.x;
        const offsetY = origin.y;
        const width = initialWidth * magnification;
        const height = initialHeight * magnification;

        const x1 = optic.sign * offsetX;
        const x2 = optic.sign * ( offsetX + width );
        const y1 = offsetY;
        const y2 = offsetY - height;

        const bounds = new Bounds2( Math.min( x1, x2 ), Math.min( y1, y2 ), Math.max( x1, x2 ), Math.max( y1, y2 ) );

        return bounds.shifted( position );
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

geometricOptics.register( 'FramedImage', FramedImage );
export default FramedImage;