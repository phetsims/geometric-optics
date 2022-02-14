// Copyright 2022, University of Colorado Boulder

/**
 * LightObjectScene is a scene in rays from 2 lights interact with a lens, and project light spots on
 * a projection screen. Note that this scene supports only Lens, not Mirror.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from '../../common/model/RaysType.js';
import LightRays from '../../common/model/LightRays.js';
import ProjectionScreen from '../../common/model/ProjectionScreen.js';
import LightSpot from '../../common/model/LightSpot.js';
import LightObject from './LightObject.js';
import lamp2_png from '../../../images/lamp2_png.js';
import lamp1_png from '../../../images/lamp1_png.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalImage from '../../common/model/OpticalImage.js';
import Guides from './Guides.js';
import GOScene, { GOSceneOptions } from '../../common/model/GOScene.js';
import Lens from '../../lens/model/Lens.js';

type LightObjectSceneOptions = {} & GOSceneOptions;

class LightObjectScene extends GOScene {

  readonly lightObject1: LightObject;
  readonly lightObject2: LightObject;
  readonly opticalImage1: OpticalImage;
  readonly opticalImage2: OpticalImage;
  readonly projectionScreen: ProjectionScreen;
  readonly lightRays1: LightRays;
  readonly lightRays2: LightRays;
  readonly lightSpot1: LightSpot;
  readonly lightSpot2: LightSpot;
  readonly guides1: Guides;
  readonly guides2: Guides;
  private readonly resetLightObjectScene: () => void;

  /**
   * @param lens
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( lens: Lens,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: LightObjectSceneOptions ) {

    const options = merge( {
      phetioState: false
    }, providedOptions );

    super( lens, options );

    this.lightObject1 = new LightObject( {
      htmlImageElement: lamp1_png,
      position: new Vector2( -170, 20 ),
      tandem: options.tandem.createTandem( 'lightObject1' ),
      phetioDocumentation: 'the first light'
    } );

    this.lightObject2 = new LightObject( {
      htmlImageElement: lamp2_png,
      position: new Vector2( -170, -20 ),
      tandem: options.tandem.createTandem( 'lightObject2' ),
      phetioDocumentation: 'the second light'
    } );

    this.opticalImage1 = new OpticalImage( this.lightObject1.positionProperty, this.optic, {
      tandem: options.tandem.createTandem( 'opticalImage1' ),
      phetioDocumentation: 'Point where light rays from the first light converge. No image is formed in this scene.'
    } );

    this.opticalImage2 = new OpticalImage( this.lightObject2.positionProperty, this.optic, {
      tandem: options.tandem.createTandem( 'opticalImage2' ),
      phetioDocumentation: 'Point where light rays from the second light converge. No image is formed in this scene.'
    } );

    this.projectionScreen = new ProjectionScreen( {
      tandem: providedOptions.tandem.createTandem( 'projectionScreen' )
    } );

    this.lightRays1 = new LightRays(
      this.lightObject1.positionProperty,
      this.optic,
      this.opticalImage1,
      raysTypeProperty,
      this.lightRaysAnimationTimeProperty,
      this.projectionScreen
    );

    this.lightRays2 = new LightRays(
      this.lightObject2.positionProperty,
      this.optic,
      this.opticalImage2,
      raysTypeProperty,
      this.lightRaysAnimationTimeProperty,
      this.projectionScreen
    );

    // Light Spots
    this.lightSpot1 = new LightSpot( this.optic, this.projectionScreen, this.lightObject1.positionProperty,
      this.opticalImage1.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot1' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the first light'
      } );
    this.lightSpot2 = new LightSpot( this.optic, this.projectionScreen, this.lightObject2.positionProperty,
      this.opticalImage2.positionProperty, {
        tandem: options.tandem.createTandem( 'lightSpot2' ),
        phetioDocumentation: 'the light spot on the projection screen that is created by the second light'
      } );

    // Guides
    this.guides1 = new Guides( this.optic, this.lightObject1.positionProperty, {
      tandem: options.tandem.createTandem( 'guides1' ),
      phetioDocumentation: 'guides associated with the first light'
    } );
    this.guides2 = new Guides( this.optic, this.lightObject2.positionProperty, {
      tandem: options.tandem.createTandem( 'guides2' ),
      phetioDocumentation: 'guides associated with the second light'
    } );

    //TODO is this complete?
    this.resetLightObjectScene = () => {
      this.lightObject1.reset();
      this.lightObject2.reset();
      this.projectionScreen.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetLightObjectScene();
  }
}

geometricOptics.register( 'LightObjectScene', LightObjectScene );
export default LightObjectScene;