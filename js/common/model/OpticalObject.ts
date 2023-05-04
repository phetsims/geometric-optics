// Copyright 2022-2023, University of Colorado Boulder

/**
 * OpticalObject is the base class for all optical objects. An optical object is anything that can be viewed with an
 * optical device (lens, mirror,...) and is referred to simply as 'Object' in the geometric optics literature.
 * Note that the term 'Object' unfortunately conflicts with JavaScript's Object class. Where there may be confusion,
 * we'll try to clarify, as in the name of this class.
 *
 * Objects may be real or virtual. A real object is one in which light rays physically emanate from the object.
 * A virtual object is one from which light rays appear to emanate but physically do not. For example, an image in
 * a mirror is a virtual object, which can in turn be used to create another image in a second mirror.
 * This simulation deals with real objects exclusively.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {

  // point from which rays propagate on the optical object
  position?: Vector2;
};

export type OpticalObjectOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

export default class OpticalObject extends PhetioObject {

  // positive integer used when labeling this object
  public readonly opticalObjectNumber: number;

  // position of the point-of-interest on the optical object, from which rays propagate
  public readonly positionProperty: Property<Vector2>;

  // x distance between the optic and object
  public readonly objectDistanceProperty: TReadOnlyProperty<number>;

  // Resets things that are specific to this class.
  private readonly resetOpticalObject: () => void;

  protected constructor( opticalObjectNumber: number,
                         opticPositionProperty: TReadOnlyProperty<Vector2>,
                         providedOptions: OpticalObjectOptions ) {
    assert && assert( Number.isInteger( opticalObjectNumber ) && opticalObjectNumber > 0,
      `opticalObjectNumber must be a positive integer: ${opticalObjectNumber}` );

    const options = optionize<OpticalObjectOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.opticalObjectNumber = opticalObjectNumber;

    this.positionProperty = new Vector2Property( options.position, {
      units: 'cm',
      isValidValue: ( position: Vector2 ) =>
        Math.abs( position.x - opticPositionProperty.value.x ) >= GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC &&
        Math.abs( position.y - opticPositionProperty.value.y ) <= GOConstants.MAX_DISTANCE_FROM_OBJECT_TO_OPTICAL_AXIS,
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioFeatured: true
    } );

    // For empirically setting the initial position of optical objects.
    phet.log && this.positionProperty.link( position => phet.log( `${this.phetioID} position=${position}` ) );

    this.objectDistanceProperty = new DerivedProperty( [ opticPositionProperty, this.positionProperty ],
      ( opticPosition, opticalObjectPosition ) => ( opticPosition.x - opticalObjectPosition.x ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'objectDistanceProperty' ),
        phetioFeatured: true,
        phetioValueType: NumberIO,
        phetioDocumentation: 'horizontal distance from the optical object to the optic'
      } );

    this.resetOpticalObject = () => {
      this.positionProperty.reset();
    };
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetOpticalObject();
  }
}

geometricOptics.register( 'OpticalObject', OpticalObject );