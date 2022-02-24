// Copyright 2022, University of Colorado Boulder

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

import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import { PickOptional, PickRequired } from '../GOTypes.js';

type OpticalObjectOptions = {
  position?: Vector2
} & PickRequired<PhetioObjectOptions, 'tandem'>
  & PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

class OpticalObject extends PhetioObject {

  // Positive integer used when labeling this object
  public readonly opticalObjectNumber: number;

  public readonly positionProperty: Property<Vector2>;

  // Resets things that are specific to this class.
  private readonly resetOpticalObject: () => void;

  /**
   * @param opticalObjectNumber
   * @param opticPositionProperty
   * @param providedOptions
   */
  constructor( opticalObjectNumber: number, opticPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: OpticalObjectOptions ) {
    assert && assert( Number.isInteger( opticalObjectNumber ) && opticalObjectNumber > 0,
      `opticalObjectNumber must be a positive integer: ${opticalObjectNumber}` );

    const options = merge( {
      position: Vector2.ZERO,
      phetioState: false
    }, providedOptions );

    super( options );

    this.opticalObjectNumber = opticalObjectNumber;

    this.positionProperty = new Vector2Property( options.position, {
      isValidValue: ( position: Vector2 ) =>
        ( position.x <= opticPositionProperty.value.x - GOConstants.MIN_DISTANCE_FROM_OBJECT_TO_OPTIC ),
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.resetOpticalObject = () => {
      this.positionProperty.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetOpticalObject();
  }

  /**
   * Computes the bounds for an optical object that uses an HTMLImageElement for its visual representation.
   * @param htmlImageElement
   * @param position
   * @param scaleFactor
   * @param originOffset
   */
  public static computeBounds( htmlImageElement: HTMLImageElement, position: Vector2, scaleFactor: number, originOffset: Vector2 ) {

    const size = new Dimension2( scaleFactor * htmlImageElement.width, scaleFactor * htmlImageElement.height );
    const origin = originOffset.timesScalar( scaleFactor );
    const offsetX = origin.x;
    const offsetY = -origin.y;  // flip sign of offset.y because +y is up in the model
    const left = position.x - offsetX;
    const bottom = position.y - offsetY - size.height;

    return size.toBounds( left, bottom );
  }
}

geometricOptics.register( 'OpticalObject', OpticalObject );
export default OpticalObject;
export type { OpticalObjectOptions };