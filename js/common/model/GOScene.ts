// Copyright 2022, University of Colorado Boulder

/**
 * GOScene is base class for all scenes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import geometricOptics from '../../geometricOptics.js';
import Optic from './Optic.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Lens from '../../lens/model/Lens.js';

type GOSceneOptions = {

  // phet-io options
  tandem: Tandem
};

class GOScene extends PhetioObject {

  readonly optic: Optic;
  readonly lightRaysAnimationTimeProperty: NumberProperty;
  private readonly resetGOObjectScene: () => void;

  /**
   * @param optic
   * @param providedOptions
   */
  constructor( optic: Optic, providedOptions: GOSceneOptions ) {

    const options = merge( {
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