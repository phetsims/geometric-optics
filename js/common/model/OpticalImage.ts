// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImage is the base class for all optical images. It describes where the image would occur, the point where
 * light rays intersect. What the image looks like is the responsibility of subclasses.  It can be instantiated
 * directly in situations (like the 'Light' scene) where you want to know where an optical image would form, but
 * you don't want to form an image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import { OpticalImageType, OpticalImageTypeValues } from './OpticalImageType.js';
import OpticalObject from './OpticalObject.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {

  // Optional alternate position of the optical object, defaults to opticalObject.positionProperty.
  // This is used for the second point-of-interest on the framed objects.
  opticalObjectPositionProperty?: IReadOnlyProperty<Vector2>;
};

export type OpticalImageOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

class OpticalImage extends PhetioObject {

  // the optic associated with this image
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

    const imageDistanceProperty = new DerivedProperty(
      [ opticalObject.objectDistanceProperty, optic.focalLengthProperty ],
      ( objectDistance: number, focalLength: number ) => {

        // address the case where the optical object shares the same x position as the focal point
        if ( objectDistance === focalLength ) {

          // Set the distance to be very large (and arbitrarily positive).
          // This should technically be Infinity, but practically must be a (very large) finite value.
          return 10e6;
        }
        else {

          // Calculated based on the thin lens law/ mirror equation
          // For a lens, a positive distance indicates that the image is to the right of the lens.
          // For a mirror, a positive distance indicates that the image is to the left of the mirror.
          return ( focalLength * objectDistance ) / ( objectDistance - focalLength );
        }
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'imageDistanceProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'Horizontal distance between optic and image, where the sign has the following significance.<br><br>' +
                             'For a lens:' +
                             '<ul>' +
                             '<li>positive is a real image to the right of the lens</li>' +
                             '<li>negative is a virtual image to the left of the lens</li>' +
                             '</ul>' +
                             'For a mirror:' +
                             '<ul>' +
                             '<li>positive is a real image to the left of the mirror</li>' +
                             '<li>negative is a virtual image to the right of the mirror</li>' +
                             '</li>'
      } );

    this.magnificationProperty = new DerivedProperty(
      [ opticalObject.objectDistanceProperty, imageDistanceProperty ],
      ( objectDistance: number, imageDistance: number ) => {

        // prevent division by zero
        if ( objectDistance === 0 ) {
          return 1; // The magnification is 1 when the object and optic are coincident.
        }
        else {
          return -1 * imageDistance / objectDistance;
        }
      }, {
        tandem: options.tandem.createTandem( 'magnificationProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO ),
        phetioDocumentation: 'Magnification of the optical image. Negative indicates that the image is inverted.'
      } );

    this.positionProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, imageDistanceProperty, this.magnificationProperty ],
      ( opticalObjectPosition: Vector2, opticPosition: Vector2, imageDistance: number, magnification: number ) => {

        // The height is determined as the vertical offset from the optical axis of the focus point.
        // The height will be negative if the optical image is inverted.
        const height = magnification * ( opticalObjectPosition.y - opticPosition.y );

        // Recall that the sign is different for lens vs mirror.
        const horizontalDisplacement = optic.sign * imageDistanceProperty.value;

        return opticPosition.plusXY( horizontalDisplacement, height );
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( Vector2.Vector2IO )
      } );

    this.opticalImageTypeProperty = new DerivedProperty( [ imageDistanceProperty ],
      ( imageDistance: number ) => ( imageDistance < 0 ) ? 'virtual' : 'real', {
        tandem: options.tandem.createTandem( 'opticalImageTypeProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( StringIO ),
        validValues: OpticalImageTypeValues
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

geometricOptics.register( 'OpticalImage', OpticalImage );
export default OpticalImage;