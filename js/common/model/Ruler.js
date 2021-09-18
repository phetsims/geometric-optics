// Copyright 2021, University of Colorado Boulder

/**
 * Model for movable ruler with option for orientation.
 *
 * @author Sarah Chang (Swarthmore College)
 */

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

    // @public (read-only) {Ruler.Orientation} orientation of the ruler (valid choices are vertical and horizontal).
    this.orientation = orientation;

    // @public {Property.<Vector2>} position of the ruler in view coordinates
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
   * Sets the length of the ruler based on multiplicative factor of absoluteScale
   * @public
   * @param {number} absoluteScale
   */
  scaleLength( absoluteScale ) {
    this.length = this.nominalLength * absoluteScale;
  }

  /**
   * Is the ruler horizontal
   * @public
   * @returns {boolean}
   */
  isHorizontal() {
    return this.orientation === Ruler.Orientation.HORIZONTAL;
  }

  /**
   * Is the ruler vertical
   * @public
   * @returns {boolean}
   */
  isVertical() {
    return this.orientation === Ruler.Orientation.VERTICAL;
  }
}

Ruler.Orientation = Enumeration.byKeys( [ 'VERTICAL', 'HORIZONTAL' ] );

geometricOptics.register( 'Ruler', Ruler );
export default Ruler;