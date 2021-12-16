// Copyright 2021, University of Colorado Boulder

/**
 * GOModel is the common top-level model for this simulation.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import geometricOptics from '../../geometricOptics.js';
import GOConstants from '../GOConstants.js';
import LightRays from './LightRays.js';
import Optic from './Optic.js';
import RaysModeEnum, { RaysModeValues } from './RaysModeEnum.js';
import Representation, { RepresentationStaticInstances } from './Representation.js';
import GORuler from './GORuler.js';
import SecondPoint from './SecondPoint.js';
import SourceObject from './SourceObject.js';
import Target from './Target.js';
import Barrier from './Barrier.js';

// constants
const RAYS_ANIMATION_TIME = 10; // length of the rays animation, in seconds

type GeometricOpticsModelOptions = {

  // optional Barrier that may block rays
  barrier?: Barrier | null,

  // representations of the source object supported by the model
  representations?: Representation[],

  // initial representation of the source object
  representation?: Representation,

  // phet-io options
  tandem: Tandem
};

class GOModel {

  // model of the optic
  readonly optic: Optic;

  // representation of the source object
  readonly representationProperty: Property<Representation>;

  // source object and first light source
  readonly sourceObject: SourceObject;

  // the second point on the source object, and the second light source
  readonly secondPoint: SecondPoint;

  // model of the target/image associated with sourceObject
  readonly firstTarget: Target;

  // target/ image associated with secondPoint
  readonly secondTarget: Target;

  // elapsed time of light rays animation
  readonly lightRaysTimeProperty: NumberProperty;

  // determines the representation used for rays
  readonly raysModeProperty: Property<RaysModeEnum>;

  // light rays associated with the first light source
  readonly lightRays1: LightRays;

  // light rays associated with the second light source
  readonly lightRays2: LightRays;

  // rulers
  readonly horizontalRuler: GORuler;
  readonly verticalRuler: GORuler;

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: GeometricOpticsModelOptions ) {

    const options = merge( {
      barrier: null,
      representations: RepresentationStaticInstances,
      representation: RepresentationStaticInstances[ 0 ]
    }, providedOptions ) as Required<GeometricOpticsModelOptions>;

    this.optic = optic;

    this.representationProperty = new Property( options.representation, {
      validValues: options.representations
    } );

    this.sourceObject = new SourceObject( this.representationProperty );

    this.secondPoint = new SecondPoint( this.representationProperty, this.sourceObject.positionProperty );

    this.firstTarget = new Target( this.sourceObject.positionProperty, this.optic, this.representationProperty );

    this.secondTarget = new Target( this.secondPoint.positionProperty, this.optic, this.representationProperty );

    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, RAYS_ANIMATION_TIME ),
      tandem: options.tandem.createTandem( 'lightRaysTimeProperty' )
    } );

    this.raysModeProperty = new Property( 'marginal', {
      validValues: RaysModeValues,
      tandem: options.tandem.createTandem( 'raysModeProperty' ),
      phetioType: Property.PropertyIO( StringIO )
    } );

    // Changing raysModeProperty resets the animation time for rays.
    this.raysModeProperty.link( () => this.lightRaysTimeProperty.reset() );

    this.lightRays1 = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.sourceObject.positionProperty,
      this.optic,
      this.firstTarget,
      options.barrier
    );

    this.lightRays2 = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.secondPoint.positionProperty,
      this.optic,
      this.secondTarget,
      options.barrier
    );

    this.horizontalRuler = new GORuler( {
      orientation: 'horizontal',
      length: GOConstants.HORIZONTAL_RULER_LENGTH,
      tandem: options.tandem.createTandem( 'horizontalRuler' )
    } );

    this.verticalRuler = new GORuler( {
      orientation: 'vertical',
      length: GOConstants.VERTICAL_RULER_LENGTH,
      tandem: options.tandem.createTandem( 'verticalRuler' )
    } );
  }

  public reset(): void {
    this.representationProperty.reset();
    this.optic.reset();
    this.sourceObject.reset();
    this.secondPoint.reset();
    this.lightRaysTimeProperty.reset();
    this.raysModeProperty.reset();
    this.horizontalRuler.reset();
    this.verticalRuler.reset();
  }

  /**
   * Steps the animation of light rays.
   * @param dt - time step, in seconds
   */
  public stepLightRays( dt: number ): void {
    const t = this.lightRaysTimeProperty.value + dt;
    assert && assert( this.lightRaysTimeProperty.range ); // {Range|null}
    if ( this.lightRaysTimeProperty.range!.contains( t ) ) {
      this.lightRaysTimeProperty.value = t;
    }
  }
}

geometricOptics.register( 'GOModel', GOModel );
export default GOModel;
export type { GeometricOpticsModelOptions };