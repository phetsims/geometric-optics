// Copyright 2022, University of Colorado Boulder

/**
 * LightObjectScene is a scene in rays from 2 lights interact with a lens, and project light spots on
 * a projection screen. Note that this scene supports only Lens, not Mirror.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from './RaysType.js';
import LightRays from './LightRays.js';
import ProjectionScreen from './ProjectionScreen.js';
import LightSpot from './LightSpot.js';
import LightObject from './LightObject.js';
import light1_png from '../../../images/light1_png.js';
import light2_png from '../../../images/light2_png.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalImage from './OpticalImage.js';
import Guides from './Guides.js';
import GOScene, { GOSceneOptions } from './GOScene.js';
import Lens from '../../lens/model/Lens.js';

type LightObjectSceneOptions = {
  lightObject1Position: Vector2,
  lightObject2Position: Vector2
} & GOSceneOptions;

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

    let opticalObjectNumber = 1;

    this.lightObject1 = new LightObject( opticalObjectNumber++, lens.positionProperty, {
      htmlImageElement: light1_png,
      position: options.lightObject1Position,
      tandem: options.tandem.createTandem( 'lightObject1' ),
      phetioDocumentation: 'the first light'
    } );

    this.lightObject2 = new LightObject( opticalObjectNumber++, lens.positionProperty, {
      htmlImageElement: light2_png,
      position: options.lightObject2Position,
      tandem: options.tandem.createTandem( 'lightObject2' ),
      phetioDocumentation: 'the second light'
    } );

    this.opticalImage1 = new OpticalImage( this.lightObject1, this.optic, {
      tandem: options.tandem.createTandem( 'opticalImage1' ),
      phetioDocumentation: 'Point where light rays from the first light converge. No image is formed in this scene.'
    } );

    this.opticalImage2 = new OpticalImage( this.lightObject2, this.optic, {
      tandem: options.tandem.createTandem( 'opticalImage2' ),
      phetioDocumentation: 'Point where light rays from the second light converge. No image is formed in this scene.'
    } );

    this.projectionScreen = new ProjectionScreen( lens.positionProperty, {
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