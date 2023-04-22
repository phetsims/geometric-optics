// Copyright 2022-2023, University of Colorado Boulder

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
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// How long the animation of light rays lasts, in seconds
const RAYS_ANIMATION_DURATION = 10;

type SelfOptions = EmptySelfOptions;

export type GOSceneOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default abstract class GOScene extends PhetioObject {

  // the optic, provided by the client, and associated with all scenes
  public readonly optic: Optic;

  // animation time for the light rays animation, determines how far the rays have propagated from the optical object
  public readonly raysAnimationTimeProperty: NumberProperty;

  // optional guides, supported by the Lens screen
  private _guides1?: Guides;
  private _guides2?: Guides;

  // Resets things that are specific to this class.
  private readonly resetGOObjectScene: () => void;

  /**
   * @param optic - the optic, shared by all scenes
   * @param providedOptions
   */
  protected constructor( optic: Optic, providedOptions: GOSceneOptions ) {

    const options = optionize<GOSceneOptions, SelfOptions, PhetioObjectOptions>()( {

      // PhetioObjectOptions
      phetioState: false
    }, providedOptions );

    super( options );

    this.optic = optic;

    this.addLinkedElement( optic, {
      tandem: options.tandem.createTandem( optic.tandem.name )
    } );

    this.raysAnimationTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, RAYS_ANIMATION_DURATION ),
      tandem: options.tandem.createTandem( 'raysAnimationTimeProperty' ),
      phetioReadOnly: true
    } );

    this.resetGOObjectScene = () => {
      this.raysAnimationTimeProperty.reset();
    };
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetGOObjectScene();
  }

  public get guides1(): Guides | undefined { return this._guides1; }

  public get guides2(): Guides | undefined { return this._guides2; }

  /**
   * Begins the animation of light rays.
   */
  public beginLightRaysAnimation(): void {
    this.raysAnimationTimeProperty.reset();
  }

  /**
   * Steps the animation of light rays.
   * @param dt - time step, in seconds
   */
  public stepLightRays( dt: number ): void {
    const tNow = this.raysAnimationTimeProperty.value;
    if ( tNow < RAYS_ANIMATION_DURATION ) {
      this.raysAnimationTimeProperty.value = Math.min( tNow + dt, RAYS_ANIMATION_DURATION );
    }
  }

  /**
   * Initializes the optional guides, called by subclasses.
   */
  protected initializeGuides( guides1PositionProperty: TReadOnlyProperty<Vector2>,
                              guides2PositionProperty: TReadOnlyProperty<Vector2> ): void {

    this._guides1 = new Guides( this.optic, guides1PositionProperty );

    this._guides2 = new Guides( this.optic, guides2PositionProperty );
  }
}

geometricOptics.register( 'GOScene', GOScene );
