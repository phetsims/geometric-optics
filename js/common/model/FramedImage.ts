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

export default class FramedImage extends OpticalImage {

  // the HTMLImageElement (PNG file) to display
  public readonly htmlImageElementProperty: IReadOnlyProperty<HTMLImageElement>;

  // bounds of the optical image's visual representation, in model coordinates
  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  // opacity of the framed image
  public readonly opacityProperty: IReadOnlyProperty<number>;

  /**
   * @param framedObject - the optical object that this image is associated with
   * @param optic - the optic is responsible for forming the optical image
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
        //REVIEW Is this code guaranteed to run after images are loaded (and the sim is being constructed), and never
        //REVIEW statically? Recommend assertion that width/height is non-zero if that's the case
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

    // This algorithm was specified by Kathy Perkins in https://github.com/phetsims/geometric-optics/issues/350.
    this.opacityProperty = new DerivedProperty(
      [ framedObject.objectDistanceProperty, optic.diameterProperty, this.magnificationProperty ],
      ( objectDistance: number, diameter: number, magnification: number ) => {

        // Kathy Perkins described this constant as "a comfortable distance from the lens, and nominally where the
        // image/object sizes are the same". This is a horizontal distance.
        const referenceObjectDistance = 160; // cm

        //REVIEW: Effect instead of Affect? (pretty sure it's not an optics thing, but not sure so I didn't change it)
        // Affect of object's distance from the optic.
        const objectDistanceFactor = referenceObjectDistance / objectDistance;

        // Affect of optic diameter
        const diameterFactor = diameter / diameterRange.max;

        // Affect of magnification.
        const magnificationFactor = Math.abs( 1 / magnification );

        // Prior to rewriting this algorithm, the opacity range was [0,0.75]. Kathy Perkins described this constant
        // like this: "it was easiest to find ... where you would get a value of 1, and then just multiply that
        // by 0.75 to create the visual effect we wanted".
        const multiplier = 0.75;

        // Multiply factors, constrain to range.
        return GOConstants.OPACITY_RANGE.constrainValue( multiplier * objectDistanceFactor * diameterFactor * magnificationFactor );
      }, {
        isValidValue: ( value: number ) => GOConstants.OPACITY_RANGE.contains( value ),

        // Not necessarily useful to iO clients, but very useful when verifying this algorithm.
        tandem: providedOptions.tandem.createTandem( 'opacityProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }
}

geometricOptics.register( 'FramedImage', FramedImage );