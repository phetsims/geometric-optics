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
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import GOConstants from '../GOConstants.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type FramedImageOptions = PickOptional<OpticalImageOptions, 'opticalObjectPositionProperty'> &
  PickRequired<OpticalImageOptions, 'tandem' | 'phetioDocumentation'>;

class FramedImage extends OpticalImage {

  // the HTMLImageElement (PNG file) to display
  public readonly htmlImageElementProperty: IReadOnlyProperty<HTMLImageElement>;

  // bounds of the optical image's visual representation, in model coordinates
  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  // opacity of the framed image
  public readonly opacityProperty: IReadOnlyProperty<number>;

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

    assert && assert( optic.diameterProperty.range ); // {Range|null}
    const diameterRange = optic.diameterProperty.range!;

    // For the history of this algorithm, see https://github.com/phetsims/geometric-optics/issues/350
    this.opacityProperty = new DerivedProperty(
      [ framedObject.opticObjectXDistanceProperty, optic.diameterProperty, this.magnificationProperty ],
      ( opticObjectXDistance: number, diameter: number, magnification: number ) => {

        // This constant was specified by Kathy Perkins in https://github.com/phetsims/geometric-optics/issues/350.
        // It is "a comfortable distance from the lens, and nominally where the image/object sizes are the same".
        const referenceObjectDistance = 160;
        
        // Affect of object's distance from the optic.
        const objectDistanceFactor = referenceObjectDistance / opticObjectXDistance;

        // Affect of optic diameter
        const diameterFactor = diameter / diameterRange.max;

        // Affect of magnification.
        const magnificationFactor = Math.abs( 1 / magnification );

        // This constant was specified by Kathy Perkins in https://github.com/phetsims/geometric-optics/issues/350.
        // Before rewriting this algorithm, the opacity range was [0,0.75]. Kathy included it here in this way
        // because "it was easiest to find ... where you would get a value of 1, and then just multiply that by 0.75
        // to create the visual effect we wanted".
        const multipler = 0.75;

        // Multiply factors, constrain to range.
        return GOConstants.OPACITY_RANGE.constrainValue( multipler * objectDistanceFactor * diameterFactor * magnificationFactor );
      }, {
        isValidValue: ( value: number ) => GOConstants.OPACITY_RANGE.contains( value ),

        //TODO https://github.com/phetsims/geometric-optics/issues/350 should this remain instrumented?
        tandem: providedOptions.tandem.createTandem( 'opacityProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

geometricOptics.register( 'FramedImage', FramedImage );
export default FramedImage;