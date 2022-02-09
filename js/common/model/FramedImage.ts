// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedImage is the model of an optical image associated with a framed object.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import Lens from '../../lens/model/Lens.js';
import Optic from './Optic.js';
import Representation from './Representation.js';
import GOConstants from '../GOConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalImage from './OpticalImage.js';

class FramedImage extends OpticalImage {

  // the HTMLImageElement to display, null if there is no HTMLImageElement
  readonly imageProperty: IReadOnlyProperty<HTMLImageElement | null>;
  // the magnification can be negative, indicating the Image is inverted.
  private readonly magnificationProperty: IReadOnlyProperty<number>;

  //TODO remove null here and checks at use sites
  //TODO document
  private readonly isInvertedProperty: IReadOnlyProperty<boolean>;

  // Bounds of the actual Image, based on the Representation
  readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  // light intensity of the Image (Hollywood) - a value between 0 and 1
  readonly lightIntensityProperty: IReadOnlyProperty<number>;

  /**
   * @param objectPositionProperty - position of the optical object
   * @param optic - model of the optic
   * @param representationProperty
   */
  constructor( objectPositionProperty: IReadOnlyProperty<Vector2>, optic: Optic,
               representationProperty: IReadOnlyProperty<Representation> ) {

    super( objectPositionProperty, optic );

    this.magnificationProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      //TODO focalLength is not used, is focalLengthProperty dependency needed?
      ( objectPosition: Vector2, opticPosition: Vector2, focalLength: number ) =>
        this.getMagnification( objectPosition, opticPosition )
    );

    //TODO REVIEW: DerivedProperty that depends on an unlisted Property?
    this.isInvertedProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( ...args: any[] ) => ( this.opticImageDistanceProperty.value > 0 )
    );

    this.imageProperty = new DerivedProperty(
      [ representationProperty, this.isVirtualProperty ],
      ( representation: Representation, isVirtual: boolean ) => {
        const isLens = ( optic instanceof Lens );
        const realImage = isLens ? representation.leftFacingInverted : representation.rightFacingInverted;
        const virtualImage = isLens ? representation.rightFacingUpright : representation.leftFacingUpright;
        return isVirtual ? virtualImage : realImage;
      } );

    this.boundsProperty = new DerivedProperty(
      [ this.positionProperty, representationProperty, this.magnificationProperty, this.isInvertedProperty ],
      //TODO isInverted is not used, is dependency needed?
      ( position: Vector2, representation: Representation, magnification: number, isInverted: boolean ) => {

        const scaleFactor = representation.scaleFactor;
        const initialOrigin = representation.rightFacingUprightOrigin.timesScalar( scaleFactor );
        const initialWidth = representation.rightFacingUpright.width * scaleFactor;
        const initialHeight = representation.rightFacingUpright.height * scaleFactor;

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

    this.lightIntensityProperty = new DerivedProperty(
      [ this.magnificationProperty, optic.diameterProperty ],
      ( magnification: number, diameter: number ) => {

        // effect of the distance on the opacity, Hollywooded as 1/magnification for upscaled Image
        const distanceFactor = Math.min( 1, Math.abs( 1 / magnification ) );

        // effect of the diameter of the optic on the light intensity of the Image (also Hollywooded)
        assert && assert( optic.diameterProperty.range ); // {Range|null}
        const diameterRange: Range = optic.diameterProperty.range!;
        const diameterFactor = diameter / diameterRange.max;
        assert && assert( diameterFactor >= 0 && diameterFactor <= 1 );

        // product of the two factors
        return distanceFactor * diameterFactor;
      }, {
        isValidValue: ( value: number ) => GOConstants.INTENSITY_RANGE.contains( value )
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

geometricOptics.register( 'FramedImage', FramedImage );
export default FramedImage;