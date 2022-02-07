// Copyright 2022, University of Colorado Boulder

/**
 * LightSourcesScene is a scene in rays from 2 light sources interact with an optic, and project light spots on
 * a projection screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../../common/model/Optic.js';
import Target from '../../common/model/Target.js';
import Property from '../../../../axon/js/Property.js';
import Representation, { LIGHT_SOURCE_REPRESENTATION } from '../../common/model/Representation.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from '../../common/model/RaysType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LightRays from '../../common/model/LightRays.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';
import LightSpot from '../../lens/model/LightSpot.js';
import Guide from '../../lens/model/Guide.js';
import LightSource from './LightSource.js';
import lamp2_png from '../../../images/lamp2_png.js';
import lamp1_png from '../../../images/lamp1_png.js';

type LightSourcesSceneOptions = {

  // phet-io options
  tandem: Tandem
};

class LightSourcesScene {

  readonly representationProperty: Property<Representation>;
  readonly optic: Optic;
  readonly lightSource1: LightSource;
  readonly lightSource2: LightSource;
  readonly target1: Target;
  readonly target2: Target;
  readonly projectionScreen: ProjectionScreen;
  readonly lightRaysTimeProperty: NumberProperty;
  readonly lightRays1: LightRays;
  readonly lightRays2: LightRays;
  readonly lightSpot1: LightSpot;
  readonly lightSpot2: LightSpot;
  readonly topGuide1: Guide;
  readonly bottomGuide1: Guide;
  readonly topGuide2: Guide;
  readonly bottomGuide2: Guide;

  /**
   * @param optic
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( optic: Optic, raysTypeProperty: Property<RaysType>, providedOptions: LightSourcesSceneOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    this.optic = optic;

    //TODO get rid of this
    this.representationProperty = new Property( LIGHT_SOURCE_REPRESENTATION, {
      validValues: [ LIGHT_SOURCE_REPRESENTATION ]
    } );

    this.lightSource1 = new LightSource( {
      htmlImageElement: lamp1_png,
      position: new Vector2( -170, 20 ),
      tandem: options.tandem.createTandem( 'lightSource1' )
    } );

    this.lightSource2 = new LightSource( {
      htmlImageElement: lamp2_png,
      position: new Vector2( -170, -20 ),
      tandem: options.tandem.createTandem( 'lightSource2' )
    } );

    this.target1 = new Target( this.lightSource1.positionProperty, this.optic, this.representationProperty );

    this.target2 = new Target( this.lightSource2.positionProperty, this.optic, this.representationProperty );

    this.projectionScreen = new ProjectionScreen( {
      tandem: providedOptions.tandem.createTandem( 'projectionScreen' )
    } );

    //TODO should each scene have this, or should it be shared by all scenes?
    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, 10 ), // determines the duration of the light rays animation
      tandem: options.tandem.createTandem( 'lightRaysTimeProperty' )
    } );

    //TODO duplicated in FramedObjectScene
    // Changing raysTypeProperty resets the animation time for rays.
    raysTypeProperty.link( () => this.lightRaysTimeProperty.reset() );

    this.lightRays1 = new LightRays(
      this.lightRaysTimeProperty,
      raysTypeProperty,
      this.representationProperty,
      this.lightSource1.positionProperty,
      this.optic,
      this.target1,
      this.projectionScreen
    );

    this.lightRays2 = new LightRays(
      this.lightRaysTimeProperty,
      raysTypeProperty,
      this.representationProperty,
      this.lightSource2.positionProperty,
      this.optic,
      this.target2,
      this.projectionScreen
    );

    // Light Spots
    this.lightSpot1 = new LightSpot( this.optic, this.projectionScreen, this.lightSource1.positionProperty,
      this.target1.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot1' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the first light source'
      } );
    this.lightSpot2 = new LightSpot( this.optic, this.projectionScreen, this.lightSource2.positionProperty,
      this.target2.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot2' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the second light source'
      } );

    // Guides
    const guidesTandem = options.tandem.createTandem( 'guides' );
    this.topGuide1 = new Guide( this.optic, this.lightSource1.positionProperty, 'top', {
      tandem: guidesTandem.createTandem( 'topGuide1' ),
      phetioDocumentation: 'TODO'
    } );
    this.bottomGuide1 = new Guide( this.optic, this.lightSource1.positionProperty, 'bottom', {
      tandem: guidesTandem.createTandem( 'bottomGuide1' ),
      phetioDocumentation: 'TODO'
    } );
    this.topGuide2 = new Guide( this.optic, this.lightSource2.positionProperty, 'top', {
      tandem: guidesTandem.createTandem( 'topGuide2' ),
      phetioDocumentation: 'TODO'
    } );
    this.bottomGuide2 = new Guide( this.optic, this.lightSource2.positionProperty, 'bottom', {
      tandem: guidesTandem.createTandem( 'bottomGuide2' ),
      phetioDocumentation: 'TODO'
    } );
  }

  //TODO is this complete?
  public reset(): void {
    this.lightSource1.reset();
    this.lightSource2.reset();
    this.lightRaysTimeProperty.reset();
    this.projectionScreen.reset();
  }

  //TODO duplicated in FramedObjectScene
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

geometricOptics.register( 'LightSourcesScene', LightSourcesScene );
export default LightSourcesScene;