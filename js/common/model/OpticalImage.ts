// Copyright 2022-2023, University of Colorado Boulder

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
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import StringUnionIO from '../../../../tandem/js/types/StringUnionIO.js';
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
  opticalObjectPositionProperty?: TReadOnlyProperty<Vector2>;

  // The phetioFeatured value for opticalImageTypeProperty
  opticalImageTypePropertyFeatured?: boolean;

  // The phetioFeatured value for magnificationProperty
  magnificationPropertyFeatured?: boolean;
};

export type OpticalImageOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem' | 'phetioDocumentation'>;

export default class OpticalImage extends PhetioObject {

  // the optic associated with this image
  public readonly optic: Optic;

  // the optical object that this optical image is associated with
  public readonly opticalObject: OpticalObject;

  // position of the optical image (the focus, as predicted by lens and mirror equation)
  public readonly positionProperty: TReadOnlyProperty<Vector2>;

  // horizontal distance from optic to image, see phetioDocumentation
  public readonly imageDistanceProperty: TReadOnlyProperty<number>;

  // whether the optical image is real or virtual
  public readonly opticalImageTypeProperty: TReadOnlyProperty<OpticalImageType>;

  // Whether the optical image is visible. The image is not visible until light rays have reached it.
  // Note that this Property has some odd quirks when used in the 'Light' scene. That scene does not have
  // optical images, so visibleProperty controls the visibility of the light spots on the projection screen.
  // For a more complete description, see https://github.com/phetsims/geometric-optics/issues/403
  public readonly visibleProperty: Property<boolean>;

  // the magnification can be negative, indicating that the optical image is inverted.
  public readonly magnificationProperty: TReadOnlyProperty<number>;

  // Resets things that are specific to this class.
  private readonly resetOpticalImage: () => void;

  public constructor( opticalObject: OpticalObject, optic: Optic, providedOptions: OpticalImageOptions ) {

    const options = optionize<OpticalImageOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions options
      opticalObjectPositionProperty: opticalObject.positionProperty,
      opticalImageTypePropertyFeatured: true,
      magnificationPropertyFeatured: true,

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

    this.imageDistanceProperty = new DerivedProperty(
      [ opticalObject.objectDistanceProperty, optic.focalLengthProperty ],
      ( objectDistance, focalLength ) => {

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
        phetioFeatured: true,
        phetioValueType: NumberIO,
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
      [ opticalObject.objectDistanceProperty, this.imageDistanceProperty ],
      ( objectDistance, imageDistance ) => {

        // prevent division by zero
        if ( objectDistance === 0 ) {
          return 1; // The magnification is 1 when the object and optic are coincident.
        }
        else {
          return -1 * imageDistance / objectDistance;
        }
      }, {
        tandem: options.tandem.createTandem( 'magnificationProperty' ),
        phetioFeatured: options.magnificationPropertyFeatured,
        phetioValueType: NumberIO,
        phetioDocumentation: 'Magnification of the optical image. Negative indicates that the image is inverted.'
      } );

    this.positionProperty = new DerivedProperty(
      [ opticalObjectPositionProperty, optic.positionProperty, this.imageDistanceProperty, this.magnificationProperty ],
      ( opticalObjectPosition, opticPosition, imageDistance, magnification ) => {

        // The height is determined as the vertical offset from the optical axis of the focus point.
        // The height will be negative if the optical image is inverted.
        const height = magnification * ( opticalObjectPosition.y - opticPosition.y );

        // Recall that the sign is different for lens vs mirror. See phetioDocumentation for imageDistanceProperty.
        return opticPosition.plusXY( optic.sign * imageDistance, height );
      }, {
        units: 'cm',
        tandem: options.tandem.createTandem( 'positionProperty' ),
        phetioFeatured: true,
        phetioValueType: Vector2.Vector2IO
      } );

    this.opticalImageTypeProperty = new DerivedProperty( [ this.imageDistanceProperty ],
      imageDistance => ( imageDistance < 0 ) ? 'virtual' : 'real', {
        tandem: options.tandem.createTandem( 'opticalImageTypeProperty' ),
        phetioFeatured: options.opticalImageTypePropertyFeatured,
        phetioValueType: StringUnionIO( OpticalImageTypeValues ),
        validValues: OpticalImageTypeValues
      } );

    this.resetOpticalImage = () => {
      this.visibleProperty.reset();
    };
  }

  public reset(): void {
    this.resetOpticalImage();
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalImage', OpticalImage );