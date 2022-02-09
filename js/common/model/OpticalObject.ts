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

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

type OpticalObjectOptions = {
  position?: Vector2,
  tandem: Tandem,
  phetioDocumentation?: string
};

class OpticalObject extends PhetioObject {

  public readonly positionProperty: Property<Vector2>;
  private readonly resetOpticalObject: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: OpticalObjectOptions ) {

    const options = merge( {
      position: Vector2.ZERO,
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.resetOpticalObject = () => {
      this.positionProperty.reset();
    };
  }

  public reset(): void {
    this.resetOpticalObject();
  }
}

geometricOptics.register( 'OpticalObject', OpticalObject );
export default OpticalObject;
export type { OpticalObjectOptions };