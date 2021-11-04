// Copyright 2021, University of Colorado Boulder

/**
 * GeometricOpticsModel is the common top-level model for this simulation.
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
import LightSpot from '../../lens/model/LightSpot.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import LightRays from './LightRays.js';
import Optic from './Optic.js';
import RaysModeEnum, { RaysModeValues } from './RaysModeEnum.js';
import Representation, { RepresentationStaticInstances } from './Representation.js';
import Ruler from './Ruler.js';
import SecondPoint from './SecondPoint.js';
import SourceObject from './SourceObject.js';
import Target from './Target.js';

// constants
const RAYS_ANIMATION_TIME = 10; // length of the rays animation, in seconds

class GeometricOpticsModel {

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

  // model of the projection screen
  //TODO irrelevant for MirrorModel, but required by LightRays constructor
  readonly projectionScreen: ProjectionScreen;

  // light spot associated with the first light source
  //TODO irrelevant for MirrorModel
  readonly firstLightSpot: LightSpot;

  // light spot associated with the second light source
  //TODO irrelevant for MirrorModel
  readonly secondLightSpot: LightSpot;

  // elapsed time of light rays animation
  readonly lightRaysTimeProperty: NumberProperty;

  // determines the representation used for rays
  readonly raysModeProperty: Property<RaysModeEnum>;

  // light rays associated with the first light source
  readonly firstLightRays: LightRays;

  // light rays associated with the second light source
  readonly secondLightRays: LightRays;

  // rulers
  readonly horizontalRuler: Ruler;
  readonly verticalRuler: Ruler;

  /**
   * @param {Optic} optic
   * @param {Object} [options]
   */
  constructor( optic: Optic, options?: any ) { //TODO-TS any

    options = merge( {
      representation: RepresentationStaticInstances[ 0 ],
      representations: RepresentationStaticInstances,

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    this.optic = optic;

    this.representationProperty = new Property<Representation>( options.representation, {
      validValues: options.representations
    } );

    this.sourceObject = new SourceObject( this.representationProperty );

    this.secondPoint = new SecondPoint( this.representationProperty, this.sourceObject.positionProperty );

    this.firstTarget = new Target( this.sourceObject.positionProperty, this.optic, this.representationProperty );

    this.secondTarget = new Target( this.secondPoint.positionProperty, this.optic, this.representationProperty );

    this.projectionScreen = new ProjectionScreen( {
      tandem: options.tandem.createTandem( 'projectionScreen' )
    } );

    this.firstLightSpot = new LightSpot(
      this.sourceObject.positionProperty,
      this.firstTarget.positionProperty,
      this.projectionScreen,
      this.optic
    );

    this.secondLightSpot = new LightSpot(
      this.secondPoint.positionProperty,
      this.secondTarget.positionProperty,
      this.projectionScreen,
      this.optic
    );

    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, RAYS_ANIMATION_TIME )
    } );

    this.raysModeProperty = new Property<RaysModeEnum>( 'marginal', {
      validValues: RaysModeValues,
      tandem: options.tandem.createTandem( 'raysModeProperty' ),
      phetioType: Property.PropertyIO( StringIO )
    } );

    // Changing raysModeProperty resets the animation time for rays.
    this.raysModeProperty.link( () => this.lightRaysTimeProperty.reset() );

    this.firstLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.sourceObject.positionProperty,
      this.projectionScreen,
      this.optic,
      this.firstTarget
    );

    this.secondLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.raysModeProperty,
      this.representationProperty,
      this.secondPoint.positionProperty,
      this.projectionScreen,
      this.optic,
      this.secondTarget
    );

    this.horizontalRuler = new Ruler( 'horizontal',
      GeometricOpticsConstants.HORIZONTAL_RULER_INITIAL_POSITION,
      GeometricOpticsConstants.HORIZONTAL_RULER_LENGTH
    );

    this.verticalRuler = new Ruler( 'vertical',
      GeometricOpticsConstants.VERTICAL_RULER_INITIAL_POSITION,
      GeometricOpticsConstants.VERTICAL_RULER_LENGTH
    );
  }

  /**
   * Resets the model
   */
  public reset() {
    this.representationProperty.reset();
    this.optic.reset();
    this.sourceObject.reset();
    this.secondPoint.reset();
    this.lightRaysTimeProperty.reset();
    this.raysModeProperty.reset();
    this.projectionScreen.reset();
    this.horizontalRuler.reset();
    this.verticalRuler.reset();
  }

  /**
   * Steps the animation of light rays.
   * @param {number} dt - time step, in seconds
   */
  public stepLightRays( dt: number ) {
    const t = this.lightRaysTimeProperty.value + dt;
    assert && assert( this.lightRaysTimeProperty.range ); // {Range|null}
    if ( this.lightRaysTimeProperty.range!.contains( t ) ) {
      this.lightRaysTimeProperty.value = t;
    }
  }
}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;