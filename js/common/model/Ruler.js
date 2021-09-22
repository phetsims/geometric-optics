// Copyright 2021, University of Colorado Boulder

/**
 * Model for movable ruler with option for orientation.
 *
 * @author Sarah Chang (Swarthmore College)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOptics from '../../geometricOptics.js';

class Ruler {

  /**
   * @param {Ruler.Orientation} orientation
   * @param {Vector2} position - position of the ruler in VIEW Coordinates
   * @param {number} length - length of the ruler in centimeters
   */
  constructor( orientation, position, length ) {
    assert && assert( Ruler.Orientation.includes( orientation ) );
    assert && assert( position instanceof Vector2 );
    assert && assert( typeof length === 'number' && isFinite( length ) && length > 0 );

    // @public (read-only) {Ruler.Orientation} orientation of the ruler
    this.orientation = orientation;

    // @public position of the ruler in view coordinates
    this.positionProperty = new Vector2Property( position );

    // @public {number} length of the ruler in centimeters.
    this.length = length;

    // @private (read-only) {number} keep track of the original (unscaled) length of the ruler
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
  scaleLength( absoluteScale ) {
    assert && assert( typeof absoluteScale === 'number' && isFinite( absoluteScale ) && absoluteScale > 0 );
    this.length = this.nominalLength * absoluteScale;
  }

  /**
   * Is the ruler vertical?
   * @public
   * @returns {boolean}
   */
  isVertical() {
    return ( this.orientation === Ruler.Orientation.VERTICAL );
  }
}

Ruler.Orientation = Enumeration.byKeys( [ 'VERTICAL', 'HORIZONTAL' ] );

geometricOptics.register( 'Ruler', Ruler );
export default Ruler;