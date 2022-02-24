// Copyright 2021-2022, University of Colorado Boulder

/**
 * Model for movable ruler with option for orientation.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import geometricOptics from '../../geometricOptics.js';
import { PickRequired } from '../GOTypes.js';

type RulerOrientation = 'horizontal' | 'vertical';

type SelfOptions = {
  orientation: RulerOrientation,
  length: number
};

type GeometricOpticsRulerOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

class GORuler {

  // orientation of the ruler
  public readonly orientation: RulerOrientation;

  // length of the ruler, in cm
  length: number;

  // original (unscaled) length of the ruler, in cm
  private readonly nominalLength: number;

  // position of the ruler, in cm
  readonly positionProperty: Property<Vector2>;

  readonly visibleProperty: Property<boolean>;

  // Resets things that are specific to this class.
  private readonly resetGORuler: () => void;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: GeometricOpticsRulerOptions ) {

    assert && assert( isFinite( providedOptions.length ) && providedOptions.length > 0 );

    this.orientation = providedOptions.orientation;
    this.length = providedOptions.length;
    this.nominalLength = providedOptions.length;

    // The initial value of position really does not matter, because position will be set when the ruler is
    // removed from the toolbox.
    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: providedOptions.tandem.createTandem( 'positionProperty' )
    } );

    this.visibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'visibleProperty' )
    } );

    this.resetGORuler = () => {
      this.positionProperty.reset();
      this.visibleProperty.reset();
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }

  public reset(): void {
    this.resetGORuler();
  }

  /**
   * Scales the length of the ruler based on zoomScale.
   * @param zoomScale
   */
  public scaleLength( zoomScale: number ): void {
    assert && assert( isFinite( zoomScale ) && zoomScale > 0 );
    this.length = this.nominalLength / zoomScale;
  }
}

geometricOptics.register( 'GORuler', GORuler );
export { GORuler as default };