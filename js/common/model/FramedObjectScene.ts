// Copyright 2022, University of Colorado Boulder

/**
 * FramedObjectScene is a scene in which rays from a single framed object interact with an optic and produce
 * an Image. Rays emanate from 2 points of interest on the framed object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import FramedObject from './FramedObject.js';
import FramedImage from './FramedImage.js';
import Property from '../../../../axon/js/Property.js';
import Representation, { FRAMED_OBJECT_REPRESENTATIONS } from './Representation.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from './RaysType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LightRays from './LightRays.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type FramedObjectSceneOptions = {

  // initial position of the framed object
  framedObjectPosition: Vector2,

  // phet-io options
  tandem: Tandem
};

class FramedObjectScene {

  readonly optic: Optic;
  readonly representationProperty: Property<Representation>;
  readonly framedObject: FramedObject;
  readonly framedImage1: FramedImage;
  readonly framedImage2: FramedImage;
  readonly lightRaysTimeProperty: NumberProperty;
  readonly lightRays1: LightRays;
  readonly lightRays2: LightRays;

  /**
   * @param optic
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( optic: Optic, raysTypeProperty: IReadOnlyProperty<RaysType>, providedOptions: FramedObjectSceneOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    this.optic = optic;

    this.representationProperty = new Property( FRAMED_OBJECT_REPRESENTATIONS[ 0 ], {
      validValues: FRAMED_OBJECT_REPRESENTATIONS
    } );

    this.framedObject = new FramedObject( this.representationProperty, {
      position: options.framedObjectPosition,
      tandem: options.tandem.createTandem( 'framedObject' )
    } );

    this.framedImage1 = new FramedImage( this.framedObject.positionProperty, this.optic, this.representationProperty );

    this.framedImage2 = new FramedImage( this.framedObject.secondPoint.positionProperty, this.optic, this.representationProperty );

    //TODO should each scene have this, or should it be shared by all scenes?
    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, 10 ), // determines the duration of the light rays animation
      tandem: options.tandem.createTandem( 'lightRaysTimeProperty' ),
      phetioReadOnly: true
    } );

    // Changing raysTypeProperty resets the animation time for rays.
    raysTypeProperty.link( () => this.lightRaysTimeProperty.reset() );

    this.lightRays1 = new LightRays(
      this.lightRaysTimeProperty,
      raysTypeProperty,
      this.framedObject.positionProperty,
      this.optic,
      this.framedImage1
    );

    this.lightRays2 = new LightRays(
      this.lightRaysTimeProperty,
      raysTypeProperty,
      this.framedObject.secondPoint.positionProperty,
      this.optic,
      this.framedImage2
    );

    //TODO add Guides ala LightSourcesScene, but for Lens screen only
  }

  //TODO is this complete?
  public reset(): void {
    this.representationProperty.reset();
    this.framedObject.reset();
    this.lightRaysTimeProperty.reset();
  }

  /**
   * Steps the animation of light rays.
   * @param dt - time step, in seconds
   */
  public stepLightRays( dt: number ): void {
    const t = Math.min( this.lightRaysTimeProperty.value + dt, this.lightRaysTimeProperty.range!.max );
    assert && assert( this.lightRaysTimeProperty.range ); // {Range|null}
    if ( this.lightRaysTimeProperty.range!.contains( t ) ) {
      this.lightRaysTimeProperty.value = t;
    }
  }
}

geometricOptics.register( 'FramedObjectScene', FramedObjectScene );
export default FramedObjectScene;