// Copyright 2021, University of Colorado Boulder

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
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';

type RulerOrientation = 'horizontal' | 'vertical';

class GeometricOpticsRuler {

  // orientation of the ruler
  private readonly orientation: RulerOrientation;
  readonly isVertical: boolean;

  // position of the ruler, in view coordinates!
  readonly positionProperty: Property<Vector2>;

  // length of the ruler, in cm
  length: number;

  // original (unscaled) length of the ruler, in cm
  private readonly nominalLength: number;

  readonly visibleProperty: BooleanProperty;

  /**
   * @param options
   */
  constructor( options?: any ) {

    options = merge( {
      orientation: 'horizontal',
      length: 100
    }, options );

    assert && assert( isFinite( options.length ) && options.length > 0 );

    this.orientation = options.orientation;
    this.isVertical = ( this.orientation === 'vertical' );

    // The initial value of position really does not matter, because position will be set when the ruler is
    // removed from the toolbox.
    this.positionProperty = new Vector2Property( Vector2.ZERO );

    this.length = options.length;
    this.nominalLength = options.length;

    this.visibleProperty = new BooleanProperty( false );
  }

  public reset(): void {
    this.positionProperty.reset();
    this.visibleProperty.reset();
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

geometricOptics.register( 'GeometricOpticsRuler', GeometricOpticsRuler );
export { GeometricOpticsRuler as default };
export type { RulerOrientation };
