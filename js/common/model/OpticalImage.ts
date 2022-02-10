// Copyright 2022, University of Colorado Boulder

//TODO this entire class needs to be reviewed/revised
/**
 * OpticalImage is the base class for all optical images. It describes where the image would occur, the point where
 * light rays intersect. What the image looks like is the responsibility of subclasses.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import { OpticalImageType, OpticalImageTypeValues } from './OpticalImageType.js';

type OpticalImageOptions = {
  tandem: Tandem,
  phetioDocumentation?: string
};

class OpticalImage extends PhetioObject {

  // the position of the focus as predicted by lens and mirror equation
  public readonly positionProperty: IReadOnlyProperty<Vector2>;

  // horizontal "distance" between Image and optic
  //TODO visibleProperty should not be in the model
  //TODO reset?
  public readonly visibleProperty: Property<boolean>;

  // For a mirror, the Image is virtual if the Image is on the opposite of the object
  readonly opticalImageTypeProperty: IReadOnlyProperty<OpticalImageType>;

  // The distance can be negative. We follow the standard sign convention used in geometric optics courses.
  protected readonly opticImageDistanceProperty: IReadOnlyProperty<number>;

  /**
   * @param opticalObjectPositionProperty
   * @param optic
   * @param providedOptions
   */
  constructor( opticalObjectPositionProperty: IReadOnlyProperty<Vector2>, optic: Optic, providedOptions: OpticalImageOptions ) {

    const options = merge( {
      phetioState: false
    }, providedOptions );

    super( options );

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
      //TODO focalLength is not used, is focalLengthProperty dependency needed?
      //TODO Calls this.getMagnification, should there be a dependency here on magnificationProperty instead?
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

    this.visibleProperty = new BooleanProperty( false ); //TODO phet-io instrumentation

    //TODO REVIEW: DerivedProperty that depends on an unlisted Property?
    this.opticalImageTypeProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, optic.focalLengthProperty ],
      ( ...args: any[] ) => ( this.opticImageDistanceProperty.value < 0 ) ? 'virtual' : 'real', {
        tandem: options.tandem.createTandem( 'opticalImageTypeProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( StringIO ),
        validValues: OpticalImageTypeValues
      } );
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