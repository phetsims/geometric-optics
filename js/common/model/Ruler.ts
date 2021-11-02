// Copyright 2021, University of Colorado Boulder

/**
 * Model for movable ruler with option for orientation.
 *
 * @author Sarah Chang (Swarthmore College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import geometricOptics from '../../geometricOptics.js';

type RulerOrientation = 'horizontal' | 'vertical';

class Ruler {

  // orientation of the ruler
  private readonly orientation: RulerOrientation;

  // position of the ruler, in view coordinates
  //TODO change this to model coordinates
  readonly positionProperty: Property<Vector2>;

  // length of the ruler, in cm
  length: number;

  // original (unscaled) length of the ruler, in cm
  private readonly nominalLength: number;

  /**
   * @param {RulerOrientation} orientation
   * @param {Vector2} position - position of the ruler in VIEW Coordinates
   * @param {number} length - length of the ruler in cm
   */
  constructor( orientation: RulerOrientation, position: Vector2, length: number ) {

    assert && assert( isFinite( length ) && length > 0 );

    this.orientation = orientation;
    this.positionProperty = new Vector2Property( position );
    this.length = length;
    this.nominalLength = length;
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
  }

  /**
   * Sets the length of the ruler based on multiplicative factor of absoluteScale.
   * @public
   * @param {number} absoluteScale
   */
  scaleLength( absoluteScale: number ) {
    assert && assert( isFinite( absoluteScale ) && absoluteScale > 0 );
    this.length = this.nominalLength * absoluteScale;
  }

  /**
   * Is the ruler vertical?
   * @public
   * @returns {boolean}
   */
  isVertical() {
    return ( this.orientation === 'vertical' );
  }
}

geometricOptics.register( 'Ruler', Ruler );
export default Ruler;
export { RulerOrientation };