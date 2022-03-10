// Copyright 2021-2022, University of Colorado Boulder

/**
 * GORuler is the model for a movable ruler, with option for orientation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
 */

import geometricOptics from '../../../geometricOptics.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import GOTool, { GOToolOptions } from './GOTool.js';

type RulerOrientation = 'horizontal' | 'vertical';

type SelfOptions = {
  orientation: RulerOrientation;
  length: number;
};

type GORulerOptions = SelfOptions & PickRequired<GOToolOptions, 'tandem'>;

class GORuler extends GOTool {

  // orientation of the ruler
  public readonly orientation: RulerOrientation;

  // length of the ruler, in cm
  public length: number;

  // original (unscaled) length of the ruler, in cm
  private readonly nominalLength: number;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: GORulerOptions ) {

    assert && assert( isFinite( providedOptions.length ) && providedOptions.length > 0 );

    super( providedOptions );

    this.orientation = providedOptions.orientation;
    this.length = providedOptions.length;
    this.nominalLength = providedOptions.length;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
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