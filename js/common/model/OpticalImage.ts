// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImage is the base class for all optical images. It describes where the image would occur, the point where
 * light rays intersect. What the image looks like is the responsibility of subclasses.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import { OpticalImageType, OpticalImageTypeValues } from './OpticalImageType.js';
import GOConstants from '../GOConstants.js';
import OpticalObject from './OpticalObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {

  // Optional alternate position of the optical object, defaults to opticalObject.positionProperty.
  // This is used for the second point-of-interest on the framed objects.
  opticalObjectPositionProperty?: IReadOnlyProperty<Vector2>;
};

export type OpticalImageOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

class OpticalImage extends PhetioObject {

  public readonly optic: Optic;

  // the optical object that this optical image is associated with
  public readonly opticalObject: OpticalObject;

  // position of the optical image (the focus, as predicted by lens and mirror equation)
  public readonly positionProperty: IReadOnlyProperty<Vector2>;

  // whether the optical image is real or virtual
  public readonly opticalImageTypeProperty: IReadOnlyProperty<OpticalImageType>;

  // whether the optical image is visible. The image is not visible until light rays have reached it.
  public readonly visibleProperty: Property<boolean>;

  // the magnification can be negative, indicating that the optical image is inverted.
  public readonly magnificationProperty: IReadOnlyProperty<number>;

  // light intensity of the optical image (Hollywooded) in the range [0,1]
  protected readonly lightIntensityProperty: IReadOnlyProperty<number>;

  // horizontal "distance" between optic and image, which can be negative.
  // Positive is a real image, negative is a virtual image.
  // For a lens, a positive distance indicates that the image is to the right of the lens.
  // For a mirror, a positive distance indicates that the image is to the left of the mirror.
  private readonly opticImageDistanceProperty: IReadOnlyProperty<number>;

  // Resets things that are specific to this class.
  private readonly resetOpticalImage: () => void;

  /**
   * @param opticalObject
   * @param optic
   * @param providedOptions
   */
  constructor( opticalObject: OpticalObject, optic: Optic, providedOptions: OpticalImageOptions ) {

    const options = optionize<OpticalImageOptions, SelfOptions, PhetioObjectOptions>( {

      // SelfOptions options
      opticalObjectPositionProperty: opticalObject.positionProperty,

      // PhetioObject options
      phetioState: false
    }, providedOptions );

    const opticalObjectPositionProperty = options.opticalObjectPositionProperty;

    super( options );

    this.optic = optic;
    this.opticalObject = opticalObject;

    this.visibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'visibleProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'This Property is controlled by the simulation and is therefore read-only. ' +
                           'When light rays are animated, the optical image is visible only after rays ' +
                           'have reached the position where the image is formed.'
    } );

    this.opticImageDistanceProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( opticalObjectPosition: Vector2, opticPosition: Vector2, focalLength: number ) => {

        // {number} horizontal distance between optic and optical object
        const opticObjectDistance = computeObjectOpticDistance( opticalObjectPosition, opticPosition );

        // address the case where the optical object shares the same x position as the focal point
        if ( opticObjectDistance === focalLength ) {

          // Set the distance to be very large (and arbitrarily positive).
          // This should technically be Infinity, but practically must be a (very large) finite value.
          return 10e6;
        }
        else {

          // Calculated based on the thin lens law/ mirror equation
          // For a lens, a positive distance indicates that the image is to the right of the lens.
          // For a mirror, a positive distance indicates that the image is to the left of the mirror.
          return ( focalLength * opticObjectDistance ) / ( opticObjectDistance - focalLength );
        }
      } );

    //TODO https://github.com/phetsims/geometric-optics/issues/330
    // focalLengthProperty is not used here. But if that dependency is removed, then the image magnification
    // is incorrect when switching the lens from convex to concave, and the mirror from concave to convex. So
    // there must be some ordering problem here, or a dependency on focalLengthProperty down in the derivation.
    this.magnificationProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( framedObjectPosition: Vector2, opticPosition: Vector2, focalLength: number ) =>
        computeMagnification( framedObjectPosition, opticPosition, this.opticImageDistanceProperty.value ), {
        tandem: options.tandem.createTandem( 'magnificationProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    this.positionProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      //TODO https://github.com/phetsims/geometric-optics/issues/330
      // focalLength is not used, is focalLengthProperty dependency needed?
      // Calls computeMagnification, should there be a dependency here on magnificationProperty instead?
      ( opticalObjectPosition: Vector2, opticPosition: Vector2, focalLength: number ) => {

        // The height is determined as the vertical offset from the optical axis of the focus point.
        // The height can be negative if the Image is inverted.
        const height = computeMagnification( opticalObjectPosition, opticPosition, this.opticImageDistanceProperty.value ) *
                       ( opticalObjectPosition.y - opticPosition.y );

        // recall that the meaning of opticImageDistanceProperty is different for lens vs mirror.
        const horizontalDisplacement = optic.sign * this.opticImageDistanceProperty.value;

        return opticPosition.plusXY( horizontalDisplacement, height );
      }, {
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO )
      } );

    this.opticalImageTypeProperty = new DerivedProperty( [ this.opticImageDistanceProperty ],
      ( opticImageDistance: number ) => ( opticImageDistance < 0 ) ? 'virtual' : 'real', {
        tandem: options.tandem.createTandem( 'opticalImageTypeProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( StringIO ),
        validValues: OpticalImageTypeValues
      } );

    this.lightIntensityProperty = new DerivedProperty(
      [ optic.diameterProperty, this.magnificationProperty ],
      ( diameter: number, magnification: number ) => {

        // Affect of optic diameter
        assert && assert( optic.diameterProperty.range ); // {Range|null}
        const diameterRange: Range = optic.diameterProperty.range!;
        const diameterFactor = diameter / diameterRange.max;
        assert && assert( diameterFactor >= 0 && diameterFactor <= 1 );

        // Affect of magnification, for up-scaled images only. For down-scaled images, magnification has no affect.
        const magnificationFactor = Math.min( 1, Math.abs( 1 / magnification ) );

        // product of the two factors
        return diameterFactor * magnificationFactor;
      }, {
        isValidValue: ( value: number ) => GOConstants.INTENSITY_RANGE.contains( value )
      } );

    this.resetOpticalImage = () => {
      this.visibleProperty.reset();
    };
  }

  public reset(): void {
    this.resetOpticalImage();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

/**
 * Returns the horizontal distance from the object to the optic.
 * A negative distance indicates that the object is to the right of the optic.
 * @param opticalObjectPosition
 * @param opticPosition
 */
function computeObjectOpticDistance( opticalObjectPosition: Vector2, opticPosition: Vector2 ): number {
  return opticPosition.x - opticalObjectPosition.x;
}

/**
 * Returns the magnification of the Image as defined in geometric optics courses.
 * A negative magnification implies that the Image is inverted.
 * @param opticalObjectPosition
 * @param opticPosition
 * @param opticImageDistance - see opticImageDistanceProperty documentation
 */
function computeMagnification( opticalObjectPosition: Vector2, opticPosition: Vector2, opticImageDistance: number ): number {

  // horizontal distance between optical object and optic
  const objectOpticDistance = computeObjectOpticDistance( opticalObjectPosition, opticPosition );

  // prevent a division by zero
  if ( objectOpticDistance === 0 ) {

    // The magnification is 1 when the object is right on the lens or mirror.
    return 1;
  }
  else {
    return -1 * opticImageDistance / objectOpticDistance;
  }
}

geometricOptics.register( 'OpticalImage', OpticalImage );
export default OpticalImage;