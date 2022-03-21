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
import Guides from './Guides.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// How long the animation of light rays lasts, in seconds
const LIGHT_RAYS_ANIMATION_DURATION = 10;

export type GOSceneOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

abstract class GOScene extends PhetioObject {

  // the optic, provided by the client, and associated with all scenes
  public readonly optic: Optic;

  // animation time for the light rays animation, determines how far the rays have propagated from the optical object
  public readonly lightRaysAnimationTimeProperty: NumberProperty;

  // guides
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

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.optic = optic;

    this.addLinkedElement( optic, {
      tandem: options.tandem.createTandem( optic.tandem.name )
    } );

    this.lightRaysAnimationTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, LIGHT_RAYS_ANIMATION_DURATION ),
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
   * Begins the animation of light rays.
   */
  public beginLightRaysAnimation(): void {
    this.lightRaysAnimationTimeProperty.reset();
  }

  /**
   * Steps the animation of light rays.
   * @param dt - time step, in seconds
   */
  public stepLightRays( dt: number ): void {
    const tNow = this.lightRaysAnimationTimeProperty.value;
    if ( tNow < LIGHT_RAYS_ANIMATION_DURATION ) {
      this.lightRaysAnimationTimeProperty.value = Math.min( tNow + dt, LIGHT_RAYS_ANIMATION_DURATION );
    }
  }
}

geometricOptics.register( 'GOScene', GOScene );
export default GOScene;