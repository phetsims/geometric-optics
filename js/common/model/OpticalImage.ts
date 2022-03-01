// Copyright 2022, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/330 this entire class needs to be reviewed/revised
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

  // Optional alternate position, defaults to opticalObject.positionProperty
  // This is used for the second point-of-interest on the frame objects.
  positionProperty?: IReadOnlyProperty<Vector2>
};

type OpticalImageOptions = SelfOptions
  & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

class OpticalImage extends PhetioObject {

  public readonly opticalObject: OpticalObject;
  public readonly optic: Optic;

  // the position of the focus as predicted by lens and mirror equation
  public readonly positionProperty: IReadOnlyProperty<Vector2>;

  // horizontal "distance" between Image and optic
  public readonly visibleProperty: Property<boolean>;

  // For a mirror, the Image is virtual if the Image is on the opposite of the object
  readonly opticalImageTypeProperty: IReadOnlyProperty<OpticalImageType>;

  // The distance can be negative. We follow the standard sign convention used in geometric optics courses.
  private readonly opticImageDistanceProperty: IReadOnlyProperty<number>;

  protected readonly lightIntensityProperty: IReadOnlyProperty<number>;

  // the magnification can be negative, indicating the Image is inverted.
  public readonly magnificationProperty: IReadOnlyProperty<number>;

  private readonly resetOpticalImage: () => void;

  /**
   * @param opticalObject
   * @param optic
   * @param providedOptions
   */
  constructor( opticalObject: OpticalObject, optic: Optic, providedOptions: OpticalImageOptions ) {

    const options = optionize<OpticalImageOptions, SelfOptions, PhetioObjectOptions>( {
      positionProperty: opticalObject.positionProperty,
      phetioState: false
    }, providedOptions );

    const opticalObjectPositionProperty = options.positionProperty;

    super( options );

    this.opticalObject = opticalObject;
    this.optic = optic;

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
        const opticObjectDistance = OpticalImage.getObjectOpticDistance( opticalObjectPosition, opticPosition );

        // address the case where the optical object shares the same x position as the focal point
        if ( opticObjectDistance === focalLength ) {

          // Set the distance to be very large (and arbitrarily positive).
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

    this.positionProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      //TODO https://github.com/phetsims/geometric-optics/issues/330
      // focalLength is not used, is focalLengthProperty dependency needed?
      // Calls this.getMagnification, should there be a dependency here on magnificationProperty instead?
      ( opticalObjectPosition: Vector2, opticPosition: Vector2, focalLength: number ) => {

        // The height is determined as the vertical offset from the optical axis of the focus point.
        // The height can be negative if the Image is inverted.
        const height = this.getMagnification( opticalObjectPosition, opticPosition ) * ( opticalObjectPosition.y - opticPosition.y );

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

    //TODO https://github.com/phetsims/geometric-optics/issues/330
    // focalLengthProperty is not used here. But if that dependency is removed, then the image magnification
    // is incorrect when switching the lens from convex to concave, and the mirror from concave to convex. So
    // there must be some ordering problem here, or a dependency on focalLengthProperty down in the derivation.
    this.magnificationProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( framedObjectPosition: Vector2, opticPosition: Vector2, focalLength: number ) =>
        this.getMagnification( framedObjectPosition, opticPosition ), {
        tandem: options.tandem.createTandem( 'magnificationProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );

    // light intensity of the image (Hollywooded) in the range [0,1]
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

  /**
   * Returns the horizontal distance from the object to the optic.
   * A negative distance indicates that the object is to the right of the optic.
   * @param opticalObjectPosition
   * @param opticPosition
   */
  static getObjectOpticDistance( opticalObjectPosition: Vector2, opticPosition: Vector2 ): number {
    return opticPosition.x - opticalObjectPosition.x;
  }

  /**
   * Returns the magnification of the Image as defined in geometric optics courses.
   * A negative magnification implies that the Image is inverted.
   * @param opticalObjectPosition
   * @param opticPosition
   */
  protected getMagnification( opticalObjectPosition: Vector2, opticPosition: Vector2 ): number {

    // horizontal distance between optical object and optic
    const objectOpticDistance = OpticalImage.getObjectOpticDistance( opticalObjectPosition, opticPosition );

    // prevent a division by zero
    if ( objectOpticDistance === 0 ) {

      // The magnification is 1 when the object is right on the lens or mirror.
      return 1;
    }
    else {
      return -1 * this.opticImageDistanceProperty.value / objectOpticDistance;
    }
  }
}

geometricOptics.register( 'OpticalImage', OpticalImage );
export default OpticalImage;
export type { OpticalImageOptions };