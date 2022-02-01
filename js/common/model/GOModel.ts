// Copyright 2021-2022, University of Colorado Boulder

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
import { RaysType, RaysTypeValues } from './RaysType.js';
import Representation, { RepresentationStaticInstances } from './Representation.js';
import GORuler from './GORuler.js';
import SecondPoint from './SecondPoint.js';
import SourceObject from './SourceObject.js';
import Target from './Target.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';

// constants
const RAYS_ANIMATION_TIME = 10; // length of the rays animation, in seconds

type GeometricOpticsModelOptions = {

  // initial position of the source object and first light source
  sourceObjectPosition: Vector2,

  // optional projection screen that may block rays
  projectionScreen?: ProjectionScreen | null,

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

  // Image associated with sourceObject
  readonly firstTarget: Target;

  // Image associated with secondPoint
  readonly secondTarget: Target;

  // optional projection screen that may block rays
  readonly projectionScreen: ProjectionScreen | null;

  // elapsed time of light rays animation
  readonly lightRaysTimeProperty: NumberProperty;

  // determines the representation used for rays
  readonly raysTypeProperty: Property<RaysType>;

  // light rays associated with the first light source
  readonly lightRays1: LightRays;

  // light rays associated with the second light source
  readonly lightRays2: LightRays;

  // rulers
  readonly horizontalRuler: GORuler;
  readonly verticalRuler: GORuler;

  // Maximum distance that things can be dragged from the optical axis, in cm. This is constrained to prevent
  // cases where the source object is close to the object and no 'Many' rays go through the optic.
  // See https://github.com/phetsims/geometric-optics/issues/289
  readonly maxDistanceFromOpticalAxis: number;

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: GeometricOpticsModelOptions ) {

    const options = merge( {
      projectionScreen: null,
      representations: RepresentationStaticInstances,
      representation: RepresentationStaticInstances[ 0 ]
    }, providedOptions );

    this.optic = optic;

    this.representationProperty = new Property( options.representation, {
      validValues: options.representations
    } );

    this.sourceObject = new SourceObject( this.representationProperty, options.sourceObjectPosition );

    this.secondPoint = new SecondPoint( this.representationProperty, this.sourceObject.positionProperty );

    this.firstTarget = new Target( this.sourceObject.positionProperty, this.optic, this.representationProperty );

    this.secondTarget = new Target( this.secondPoint.positionProperty, this.optic, this.representationProperty );

    this.projectionScreen = options.projectionScreen;

    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, RAYS_ANIMATION_TIME ),
      tandem: options.tandem.createTandem( 'lightRaysTimeProperty' )
    } );

    this.raysTypeProperty = new Property( 'marginal', {
      validValues: RaysTypeValues,
      tandem: options.tandem.createTandem( 'raysTypeProperty' ),
      phetioType: Property.PropertyIO( StringIO )
    } );

    // Changing raysTypeProperty resets the animation time for rays.
    this.raysTypeProperty.link( () => this.lightRaysTimeProperty.reset() );

    this.lightRays1 = new LightRays(
      this.lightRaysTimeProperty,
      this.raysTypeProperty,
      this.representationProperty,
      this.sourceObject.positionProperty,
      this.optic,
      this.firstTarget,
      options.projectionScreen
    );

    this.lightRays2 = new LightRays(
      this.lightRaysTimeProperty,
      this.raysTypeProperty,
      this.representationProperty,
      this.secondPoint.positionProperty,
      this.optic,
      this.secondTarget,
      options.projectionScreen
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

    this.maxDistanceFromOpticalAxis = 100; // cm
  }

  public reset(): void {
    this.representationProperty.reset();
    this.optic.reset();
    this.sourceObject.reset();
    this.secondPoint.reset();
    this.lightRaysTimeProperty.reset();
    this.raysTypeProperty.reset();
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