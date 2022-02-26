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
import { OpticalImageType } from './OpticalImageType.js';
import GOQueryParameters from '../GOQueryParameters.js';
import Utils from '../../../../dot/js/Utils.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { PickOptional } from '../../../../phet-core/js/types/PickOptional.js';

type FramedImageOptions = PickRequired<OpticalImageOptions, 'tandem' | 'phetioDocumentation'>
  & PickOptional<OpticalImageOptions, 'positionProperty'>;

class FramedImage extends OpticalImage {

  // the HTMLImageElement to display
  readonly htmlImageElementProperty: IReadOnlyProperty<HTMLImageElement>;

  readonly opacityProperty: IReadOnlyProperty<number>;

  // Bounds of the optical image's visual representation, in model coordinates
  readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  /**
   * @param framedObject - the optical object that this image is associated with
   * @param optic
   * @param providedOptions
   */
  constructor( framedObject: FramedObject, optic: Optic, providedOptions: FramedImageOptions ) {

    super( framedObject, optic, providedOptions );

    this.htmlImageElementProperty = new DerivedProperty(
      [ framedObject.objectHTMLImageElementsProperty, this.opticalImageTypeProperty ],
      ( objectHTMLImageElements: ObjectHTMLImageElements, opticalImageType: OpticalImageType ) => {
        const isLens = ( optic instanceof Lens );
        const realImage = isLens ? objectHTMLImageElements.leftFacingInverted : objectHTMLImageElements.rightFacingInverted;
        const virtualImage = isLens ? objectHTMLImageElements.rightFacingUpright : objectHTMLImageElements.leftFacingUpright;
        return ( opticalImageType === 'real' ) ? realImage : virtualImage;
      } );

    this.opacityProperty = new DerivedProperty( [ this.lightIntensityProperty ], ( lightIntensity: number ) =>
      Utils.linear( 0, 1, GOQueryParameters.frameImageOpacityRange[ 0 ], GOQueryParameters.frameImageOpacityRange[ 1 ], lightIntensity )
    );

    this.boundsProperty = new DerivedProperty(
      [ this.htmlImageElementProperty, this.positionProperty, this.magnificationProperty ],
      ( htmlImageElement: HTMLImageElement, position: Vector2, magnification: number ) => {

        const scaleFactor = framedObject.scaleFactor;
        const initialOrigin = framedObject.originOffset.timesScalar( scaleFactor );
        const initialWidth = htmlImageElement.width * scaleFactor;
        const initialHeight = htmlImageElement.height * scaleFactor;

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