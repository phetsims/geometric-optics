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
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

type RulerOrientation = 'horizontal' | 'vertical';

type GeometricOpticsRulerOptions = {
  orientation?: RulerOrientation,
  length?: number,

  // phet-io options
  tandem: Tandem
};

class GORuler {

  // orientation of the ruler
  private readonly orientation: RulerOrientation;
  readonly isVertical: boolean;

  // position of the ruler, in cm
  readonly positionProperty: Property<Vector2>;

  // length of the ruler, in cm
  length: number;

  // original (unscaled) length of the ruler, in cm
  private readonly nominalLength: number;

  readonly visibleProperty: Property<boolean>;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: GeometricOpticsRulerOptions ) {

    const options = merge( {
      orientation: 'horizontal',
      length: 100
    }, providedOptions ) as Required<GeometricOpticsRulerOptions>;

    assert && assert( isFinite( options.length ) && options.length > 0 );

    this.orientation = options.orientation;
    this.isVertical = ( this.orientation === 'vertical' );

    // The initial value of position really does not matter, because position will be set when the ruler is
    // removed from the toolbox.
    this.positionProperty = new Vector2Property( Vector2.ZERO, {
      tandem: options.tandem.createTandem( 'positionProperty' )
    } );

    this.length = options.length;
    this.nominalLength = options.length;

    this.visibleProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );
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

geometricOptics.register( 'GORuler', GORuler );
export { GORuler as default };