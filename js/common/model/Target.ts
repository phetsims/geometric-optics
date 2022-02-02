// Copyright 2021-2022, University of Colorado Boulder

/**
 * Target is the model for what is called 'Image' in optics.  We're avoiding the term 'image' because it conflicts
 * with scenery.Image. An optical Image can be real or virtual. It is responsible for the position, magnification,
 * opacity, and bounds.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import Lens from '../../lens/model/Lens.js';
import Optic from './Optic.js';
import Representation from './Representation.js';
import GOConstants from '../GOConstants.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

class Target {

  //TODO visibleProperty should not be in the model
  public readonly visibleProperty: Property<boolean>;

  // horizontal "distance" between Image and optic
  // the position of the focus as predicted by lens and mirror equation
  public readonly positionProperty: IReadOnlyProperty<Vector2>;

  // For a mirror, the Image is virtual if the Image is on the opposite of the object
  readonly isVirtualProperty: IReadOnlyProperty<boolean>;

  // Bounds of the actual Image, based on the Representation
  readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  // light intensity of the Image (Hollywood) - a value between 0 and 1
  readonly lightIntensityProperty: IReadOnlyProperty<number>;

  // the HTMLImageElement to display, null if there is no HTMLImageElement
  readonly imageProperty: IReadOnlyProperty<HTMLImageElement | null>;

  // The distance can be negative. We follow the standard sign convention used in geometric optics courses.
  private readonly targetOpticDistanceProperty: IReadOnlyProperty<number>;

  // the magnification can be negative, indicating the Image is inverted.
  private readonly magnificationProperty: IReadOnlyProperty<number>;

  //TODO document
  private readonly isInvertedProperty: IReadOnlyProperty<boolean>;

  /**
   * @param objectPositionProperty - position of the source object or light source
   * @param optic - model of the optic
   * @param representationProperty
   */
  constructor( objectPositionProperty: IReadOnlyProperty<Vector2>, optic: Optic,
               representationProperty: IReadOnlyProperty<Representation> ) {

    this.targetOpticDistanceProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( objectPosition: Vector2, opticPosition: Vector2, focalLength: number ) => {

        // {number} horizontal distance between optic and source object
        const opticObjectDistance = getObjectOpticDistance( objectPosition, opticPosition );

        // address the case where the source object shares the same x position as the focal point
        if ( opticObjectDistance === focalLength ) {

          // Set the target distance to be very large (and arbitrarily positive).
          // This should technically be Infinity, but practically must be a (very large) finite value.
          return 10e6;
        }
        else {

          // Calculated based on the thin lens law/ mirror equation
          // For a lens, a positive distance, indicates that the Image is on the opposite of object (wrt to the lens)
          // For a mirror, a positive distance indicates that the Image is on the same side as the object.
          return ( focalLength * opticObjectDistance ) / ( opticObjectDistance - focalLength );
        }
      } );

    this.visibleProperty = new BooleanProperty( false ); //TODO phet-io instrumentation

    this.positionProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      //TODO focalLength is not used, is focalLengthProperty dependency needed?
      //TODO Calls this.getMagnification, should there be a dependency here on magnificationProperty instead?
      ( objectPosition: Vector2, opticPosition: Vector2, focalLength: number ) => {

        // The height is determined as the vertical offset from the optical axis of the focus point.
        // The height can be negative if the Image is inverted.
        const height = this.getMagnification( objectPosition, opticPosition ) * ( objectPosition.y - opticPosition.y );

        // horizontal distance between Image and optic.
        const targetOpticDistance = this.targetOpticDistanceProperty.value;

        // recall that the meaning of targetOpticDistance is different for a lens and mirror.
        const horizontalDisplacement = optic.sign * targetOpticDistance;

        return opticPosition.plusXY( horizontalDisplacement, height );
      } );

    this.magnificationProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      //TODO focalLength is not used, is focalLengthProperty dependency needed?
      ( objectPosition: Vector2, opticPosition: Vector2, focalLength: number ) =>
        this.getMagnification( objectPosition, opticPosition )
    );

    // REVIEW: DerivedProperty that depends on an unlisted Property?
    this.isInvertedProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( ...args: any[] ) => ( this.targetOpticDistanceProperty.value > 0 )
    );

    // REVIEW: DerivedProperty that depends on an unlisted Property?
    this.isVirtualProperty = new DerivedProperty(
      [ objectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( ...args: any[] ) => ( this.targetOpticDistanceProperty.value < 0 )
    );

    this.boundsProperty = new DerivedProperty(
      [ this.positionProperty, representationProperty, this.magnificationProperty, this.isInvertedProperty ],
      //TODO isInverted is not used, is dependency needed?
      ( position: Vector2, representation: Representation, magnification: number, isInverted: boolean ) => {

        const scaleFactor = representation.scaleFactor;
        const initialOffset = representation.rightFacingUprightOffset.timesScalar( scaleFactor );
        const initialWidth = representation.rightFacingUpright.width * scaleFactor;
        const initialHeight = representation.rightFacingUpright.height * scaleFactor;

        const offset = initialOffset.timesScalar( magnification );
        const width = initialWidth * magnification;
        const height = initialHeight * magnification;

        const x1 = optic.sign * offset.x;
        const x2 = optic.sign * ( offset.x + width );
        const y1 = offset.y;
        const y2 = offset.y - height;

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

    this.imageProperty = new DerivedProperty(
      [ representationProperty, this.isVirtualProperty ],
      ( representation: Representation, isVirtual: boolean ) => {
        const isLens = ( optic instanceof Lens );
        const realImage = isLens ? representation.leftFacingInverted : representation.rightFacingInverted;
        const virtualImage = isLens ? representation.rightFacingUpright : representation.leftFacingUpright;
        return isVirtual ? virtualImage : realImage;
      } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  /**
   * Returns the magnification of the Image as defined in geometric optics courses.
   * A negative magnification implies that the Image is inverted.
   * @param objectPosition
   * @param opticPosition
   */
  private getMagnification( objectPosition: Vector2, opticPosition: Vector2 ): number {

    // horizontal distance between source object (or light source) and optic
    const objectOpticDistance = getObjectOpticDistance( objectPosition, opticPosition );

    // prevent a division by zero
    if ( objectOpticDistance === 0 ) {

      // The magnification is 1 when the object is right on the lens or mirror.
      return 1;
    }
    else {
      return -1 * this.targetOpticDistanceProperty.value / objectOpticDistance;
    }
  }
}

/**
 * Returns the horizontal distance from the object to the optic.
 * A negative distance indicates that the object is to the right of the optic.
 * @param objectPosition
 * @param opticPosition
 */
function getObjectOpticDistance( objectPosition: Vector2, opticPosition: Vector2 ): number {
  return opticPosition.x - objectPosition.x;
}

geometricOptics.register( 'Target', Target );
export default Target;