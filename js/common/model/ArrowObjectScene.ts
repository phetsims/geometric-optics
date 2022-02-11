// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObjectScene is a scene in which rays from two arrows interact with an optic and produce an Image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from './RaysType.js';
import LightRays from './LightRays.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Lens from '../../lens/model/Lens.js';
import Guides from '../../lens/model/Guides.js';
import ArrowObject from './ArrowObject.js';
import ArrowImage from './ArrowImage.js';
import GOColors from '../GOColors.js';
import GOObjectScene, { GOObjectSceneOptions } from './GOObjectScene.js';

type ArrowObjectSceneOptions = {

  // initial positions of the arrow objects
  arrowObject1Position: Vector2,
  arrowObject2Position: Vector2
} & GOObjectSceneOptions;

class ArrowObjectScene extends GOObjectScene {

  readonly arrowObject1: ArrowObject;
  readonly arrowObject2: ArrowObject;
  readonly arrowImage1: ArrowImage;
  readonly arrowImage2: ArrowImage;
  readonly lightRays1: LightRays;
  readonly lightRays2: LightRays;
  readonly guides1: Guides | null;
  readonly guides2: Guides | null;
  private readonly resetArrowObjectScene: () => void;

  /**
   * @param optic
   * @param raysTypeProperty
   * @param providedOptions
   */
  constructor( optic: Optic,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: ArrowObjectSceneOptions ) {

    const options = merge( {
      phetioState: false
    }, providedOptions );

    super( optic, options );

    this.arrowObject1 = new ArrowObject( {
      position: options.arrowObject1Position,
      fill: GOColors.arrow1FillProperty,
      stroke: GOColors.arrow1StrokeProperty,
      tandem: options.tandem.createTandem( 'arrowObject1' )
    } );

    this.arrowObject2 = new ArrowObject( {
      position: options.arrowObject2Position,
      fill: GOColors.arrow2FillProperty,
      stroke: GOColors.arrow2StrokeProperty,
      tandem: options.tandem.createTandem( 'arrowObject2' )
    } );

    this.arrowImage1 = new ArrowImage( this.arrowObject1, this.optic, {
      tandem: options.tandem.createTandem( 'arrowImage1' ),
      phetioDocumentation: 'optical image associated with the first arrow object'
    } );

    this.arrowImage2 = new ArrowImage( this.arrowObject2, this.optic, {
      tandem: options.tandem.createTandem( 'arrowImage2' ),
      phetioDocumentation: 'optical image associated with the second arrow object'
    } );

    this.lightRays1 = new LightRays(
      this.lightRaysAnimationTimeProperty,
      raysTypeProperty,
      this.arrowObject1.positionProperty,
      this.optic,
      this.arrowImage1
    );

    this.lightRays2 = new LightRays(
      this.lightRaysAnimationTimeProperty,
      raysTypeProperty,
      this.arrowObject2.positionProperty,
      this.optic,
      this.arrowImage2
    );

    // Guides
    if ( optic instanceof Lens ) {
      this.guides1 = new Guides( this.optic, this.arrowObject1.positionProperty, {
        tandem: options.tandem.createTandem( 'guides1' ),
        phetioDocumentation: 'guides associated with the first arrow object'
      } );
      this.guides2 = new Guides( this.optic, this.arrowObject2.positionProperty, {
        tandem: options.tandem.createTandem( 'guides2' ),
        phetioDocumentation: 'guides associated with the second arrow object'
      } );
    }
    else {
      this.guides1 = null;
      this.guides2 = null;
    }

    //TODO is this complete?
    this.resetArrowObjectScene = () => {
      this.arrowObject1.reset();
      this.arrowObject2.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetArrowObjectScene();
  }
}

geometricOptics.register( 'ArrowObjectScene', ArrowObjectScene );
export default ArrowObjectScene;