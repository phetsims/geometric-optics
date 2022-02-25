// Copyright 2022, University of Colorado Boulder

/**
 * GOScene is base class for all scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Lens from '../../lens/model/Lens.js';
import Guides from './Guides.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type GOSceneOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

abstract class GOScene extends PhetioObject {

  readonly optic: Optic;
  readonly lightRaysAnimationTimeProperty: NumberProperty;
  abstract readonly guides1: Guides | null;
  abstract readonly guides2: Guides | null;

  // Resets things that are specific to this class.
  private readonly resetGOObjectScene: () => void;

  /**
   * @param optic
   * @param providedOptions
   */
  protected constructor( optic: Optic, providedOptions: GOSceneOptions ) {

    const options = optionize<GOSceneOptions, {}, PhetioObjectOptions>( {
      phetioState: false
    }, providedOptions );

    super( options );

    this.optic = optic;

    this.addLinkedElement( optic, {
      tandem: options.tandem.createTandem( ( optic instanceof Lens ) ? 'lens' : 'mirror' )
    } );

    this.lightRaysAnimationTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, 10 ), // determines the duration of the light rays animation
      tandem: options.tandem.createTandem( 'lightRaysAnimationTimeProperty' ),
      phetioReadOnly: true
    } );

    this.resetGOObjectScene = () => {
      this.lightRaysAnimationTimeProperty.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetGOObjectScene();
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

geometricOptics.register( 'GOScene', GOScene );
export default GOScene;
export type { GOSceneOptions };