// Copyright 2022, University of Colorado Boulder

//TODO lots of duplication with FramedObjectScene
/**
 * LightSourceScene is a scene in rays from 2 light sources interact with an optic, and project light spots on
 * a projection screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from '../../common/model/Optic.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from '../../common/model/RaysType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LightRays from '../../common/model/LightRays.js';
import ProjectionScreen from '../../lens/model/ProjectionScreen.js';
import LightSpot from '../../lens/model/LightSpot.js';
import LightSource from './LightSource.js';
import lamp2_png from '../../../images/lamp2_png.js';
import lamp1_png from '../../../images/lamp1_png.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalImage from '../../common/model/OpticalImage.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Guides from './Guides.js';

type LightSourcesSceneOptions = {

  // phet-io options
  tandem: Tandem
};

class LightSourceScene extends PhetioObject {

  readonly optic: Optic;
  readonly lightSource1: LightSource;
  readonly lightSource2: LightSource;
  readonly opticalImage1: OpticalImage;
  readonly opticalImage2: OpticalImage;
  readonly projectionScreen: ProjectionScreen;
  readonly lightRaysAnimationTimeProperty: NumberProperty;
  readonly lightRays1: LightRays;
  readonly lightRays2: LightRays;
  readonly lightSpot1: LightSpot;
  readonly lightSpot2: LightSpot;
  readonly guides1: Guides;
  readonly guides2: Guides;
  private readonly resetLightSourcesScene: () => void;

  /**
   * @param optic
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( optic: Optic,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: LightSourcesSceneOptions ) {

    const options = merge( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.optic = optic;

    this.addLinkedElement( optic, {
      tandem: options.tandem.createTandem( 'optic' )
    } );

    this.lightSource1 = new LightSource( {
      htmlImageElement: lamp1_png,
      position: new Vector2( -170, 20 ),
      tandem: options.tandem.createTandem( 'lightSource1' ),
      phetioDocumentation: 'the first light source'
    } );

    this.lightSource2 = new LightSource( {
      htmlImageElement: lamp2_png,
      position: new Vector2( -170, -20 ),
      tandem: options.tandem.createTandem( 'lightSource2' ),
      phetioDocumentation: 'the second light source'
    } );

    this.opticalImage1 = new OpticalImage( this.lightSource1.positionProperty, this.optic, {
      tandem: options.tandem.createTandem( 'opticalImage1' ),
      phetioDocumentation: 'Point where light rays from the first light source converge. No image is formed in this scene.'
    } );

    this.opticalImage2 = new OpticalImage( this.lightSource2.positionProperty, this.optic, {
      tandem: options.tandem.createTandem( 'opticalImage2' ),
      phetioDocumentation: 'Point where light rays from the second light source converge. No image is formed in this scene.'
    } );

    this.projectionScreen = new ProjectionScreen( {
      tandem: providedOptions.tandem.createTandem( 'projectionScreen' )
    } );

    this.lightRaysAnimationTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, 10 ), // determines the duration of the light rays animation
      tandem: options.tandem.createTandem( 'lightRaysAnimationTimeProperty' ),
      phetioReadOnly: true
    } );

    this.lightRays1 = new LightRays(
      this.lightRaysAnimationTimeProperty,
      raysTypeProperty,
      this.lightSource1.positionProperty,
      this.optic,
      this.opticalImage1,
      this.projectionScreen
    );

    this.lightRays2 = new LightRays(
      this.lightRaysAnimationTimeProperty,
      raysTypeProperty,
      this.lightSource2.positionProperty,
      this.optic,
      this.opticalImage2,
      this.projectionScreen
    );

    // Light Spots
    this.lightSpot1 = new LightSpot( this.optic, this.projectionScreen, this.lightSource1.positionProperty,
      this.opticalImage1.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot1' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the first light source'
      } );
    this.lightSpot2 = new LightSpot( this.optic, this.projectionScreen, this.lightSource2.positionProperty,
      this.opticalImage2.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot2' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the second light source'
      } );

    // Guides
    this.guides1 = new Guides( this.optic, this.lightSource1.positionProperty, {
      tandem: options.tandem.createTandem( 'guides1' ),
      phetioDocumentation: 'guides associated with the first light source'
    } );
    this.guides2 = new Guides( this.optic, this.lightSource2.positionProperty, {
      tandem: options.tandem.createTandem( 'guides2' ),
      phetioDocumentation: 'guides associated with the second light source'
    } );

    //TODO is this complete?
    this.resetLightSourcesScene = () => {
      this.lightSource1.reset();
      this.lightSource2.reset();
      this.lightRaysAnimationTimeProperty.reset();
      this.projectionScreen.reset();
    };
  }

  public reset(): void {
    this.resetLightSourcesScene();
  }

  //TODO duplicated in FramedObjectScene
  /**
   * Steps the animation of light rays.
   * @param dt - time step, in seconds
   */
  public stepLightRays( dt: number ): void {
    const t = Math.min( this.lightRaysAnimationTimeProperty.value + dt, this.lightRaysAnimationTimeProperty.range!.max );
    assert && assert( this.lightRaysAnimationTimeProperty.range ); // {Range|null}
    if ( this.lightRaysAnimationTimeProperty.range!.contains( t ) ) {
      this.lightRaysAnimationTimeProperty.value = t;
    }
  }
}

geometricOptics.register( 'LightSourceScene', LightSourceScene );
export default LightSourceScene;