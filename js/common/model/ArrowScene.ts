// Copyright 2022, University of Colorado Boulder

/**
 * ArrowScene is a scene in which rays from two arrows interact with an optic and produce an Image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { RaysType } from './RaysType.js';
import LightRays from './LightRays.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Lens from '../../lens/model/Lens.js';
import Guides from './Guides.js';
import ArrowObject from './ArrowObject.js';
import ArrowImage from './ArrowImage.js';
import GOColors from '../GOColors.js';
import GOScene, { GOSceneOptions } from './GOScene.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {

  // initial positions of the arrow objects
  arrowObject1Position: Vector2;
  arrowObject2Position: Vector2;
};

type ArrowObjectSceneOptions = SelfOptions & PickRequired<GOSceneOptions, 'tandem'>;

export default class ArrowScene extends GOScene {

  // the elements that make up this scene
  public readonly arrowObject1: ArrowObject;
  public readonly arrowObject2: ArrowObject;
  public readonly arrowImage1: ArrowImage;
  public readonly arrowImage2: ArrowImage;
  public readonly lightRays1: LightRays;
  public readonly lightRays2: LightRays;
  public readonly guides1: Guides | null;
  public readonly guides2: Guides | null;

  // Resets things that are specific to this class.
  private readonly resetArrowObjectScene: () => void;

  /**
   * @param optic - the optic, shared by all scenes
   * @param raysTypeProperty - the representation used for rays
   * @param providedOptions
   */
  constructor( optic: Optic,
               raysTypeProperty: IReadOnlyProperty<RaysType>,
               providedOptions: ArrowObjectSceneOptions ) {

    super( optic, providedOptions );

    let opticalObjectNumber = 1;

    this.arrowObject1 = new ArrowObject( opticalObjectNumber++, optic.positionProperty, {
      position: providedOptions.arrowObject1Position,
      fill: GOColors.arrow1FillProperty,
      tandem: providedOptions.tandem.createTandem( 'arrowObject1' )
    } );

    this.arrowObject2 = new ArrowObject( opticalObjectNumber++, optic.positionProperty, {
      position: providedOptions.arrowObject2Position,
      fill: GOColors.arrow2FillProperty,
      tandem: providedOptions.tandem.createTandem( 'arrowObject2' )
    } );

    this.arrowImage1 = new ArrowImage( this.arrowObject1, this.optic, {
      tandem: providedOptions.tandem.createTandem( 'arrowImage1' ),
      phetioDocumentation: 'optical image associated with the first arrow object'
    } );

    this.arrowImage2 = new ArrowImage( this.arrowObject2, this.optic, {
      tandem: providedOptions.tandem.createTandem( 'arrowImage2' ),
      phetioDocumentation: 'optical image associated with the second arrow object'
    } );

    this.lightRays1 = new LightRays(
      this.arrowObject1.positionProperty,
      this.optic,
      this.arrowImage1,
      raysTypeProperty,
      this.raysAnimationTimeProperty
    );

    this.lightRays2 = new LightRays(
      this.arrowObject2.positionProperty,
      this.optic,
      this.arrowImage2,
      raysTypeProperty,
      this.raysAnimationTimeProperty
    );

    // Guides, for the Lens screen only
    if ( optic instanceof Lens ) {
      this.guides1 = new Guides( this.optic, this.arrowObject1.positionProperty, {
        tandem: providedOptions.tandem.createTandem( 'guides1' ),
        phetioDocumentation: 'guides associated with the first arrow object'
      } );
      this.guides2 = new Guides( this.optic, this.arrowObject2.positionProperty, {
        tandem: providedOptions.tandem.createTandem( 'guides2' ),
        phetioDocumentation: 'guides associated with the second arrow object'
      } );
    }
    else {
      this.guides1 = null;
      this.guides2 = null;
    }

    this.resetArrowObjectScene = () => {
      //REVIEW: Seems less verbose and easier to move resets to the actual reset() method
      this.arrowObject1.reset();
      this.arrowObject2.reset();
      this.arrowImage1.reset();
      this.arrowImage2.reset();
    };
  }

  public override reset(): void {
    super.reset();
    this.resetArrowObjectScene();
  }
}

geometricOptics.register( 'ArrowScene', ArrowScene );