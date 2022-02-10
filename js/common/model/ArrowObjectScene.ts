// Copyright 2022, University of Colorado Boulder

//TODO lots of duplication with FramedObjectScene
/**
 * ArrowObjectScene is a scene in which rays from two arrows interact with an optic and produce an Image.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import { RaysType } from './RaysType.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import LightRays from './LightRays.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Lens from '../../lens/model/Lens.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Guides from '../../lens/model/Guides.js';
import ArrowObject from './ArrowObject.js';
import ArrowImage from './ArrowImage.js';
import GOColors from '../GOColors.js';

type ArrowObjectSceneOptions = {

  // initial positions of the arrow objects
  arrowObject1Position: Vector2,
  arrowObject2Position: Vector2,

  // phet-io options
  tandem: Tandem
};

class ArrowObjectScene extends PhetioObject {

  readonly optic: Optic;
  readonly arrowObject1: ArrowObject;
  readonly arrowObject2: ArrowObject;
  readonly arrowImage1: ArrowImage;
  readonly arrowImage2: ArrowImage;
  readonly lightRaysAnimationTimeProperty: NumberProperty;
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

    super( options );

    this.optic = optic;

    this.addLinkedElement( optic, {
      tandem: options.tandem.createTandem( 'optic' )
    } );

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

    this.lightRaysAnimationTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, 10 ), // determines the duration of the light rays animation
      tandem: options.tandem.createTandem( 'lightRaysAnimationTimeProperty' ),
      phetioReadOnly: true
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
      this.lightRaysAnimationTimeProperty.reset();
    };
  }

  public reset(): void {
    this.resetArrowObjectScene();
  }

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

geometricOptics.register( 'ArrowObjectScene', ArrowObjectScene );
export default ArrowObjectScene;